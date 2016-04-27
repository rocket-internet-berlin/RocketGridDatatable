'use strict';

import { IDataTableResponse, IPresentationService } from 'rocketGridDatatable'
import { EVENT_PAGE_CHANGED_DATA_TABLE, EVENT_REFRESH_DATA_TABLE_PREFIX } from '../dist/events';
import { DataTableSortingHelper } from './datatable.helper';

interface IDataTableScopeContent {
    $promise: ng.IPromise<any>;
    $resolved: boolean;

    // initial scope
    additionalQueryParameters: {};
    data: IDataTableResponse<any>;
    serviceName: string;

    // search
    isSearchAllowed: boolean;
    searchValue: string;

    // other scope properties
    isLoading: boolean;
    uniqueKey: string;

    // data pagination
    pageChanged: (triggeredBySearch?: boolean, page?: number) => void;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
}

interface IDataTableScope extends ng.IScope {
    dataTable: IDataTableScopeContent;
}

class DataTableDirective implements ng.IDirective {
    private service: IPresentationService;
    private $scope: IDataTableScope;

    constructor (
        protected $injector: ng.auto.IInjectorService,
        protected $timeout: ng.ITimeoutService,
        protected usSpinnerService: ISpinnerService
    ) {
        return this.create();
    }

    public linkFn ($scope: IDataTableScope, elem: ng.IAugmentedJQuery): void {
        let sortableColumns = elem.find('.grid-datatable table thead th[data-sort]');

        (new DataTableSortingHelper(
            sortableColumns,
            this.service,
            $scope.dataTable.pageChanged
        )).initSorting();
    }

    public controller ($scope: IDataTableScope): void {
        this.$scope = $scope;
        let scopeContent: IDataTableScopeContent = $scope.dataTable;
        scopeContent.isSearchAllowed = !!scopeContent.isSearchAllowed;
        scopeContent.searchValue = '';

        this.service = <any>this.$injector.get(scopeContent.serviceName + 'PresentationService');
        scopeContent.uniqueKey = scopeContent.uniqueKey || Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 6);
        scopeContent.currentPage = 1;
        scopeContent.itemsPerPage = this.service.getLimit();
        scopeContent.pageChanged = (triggeredBySearch: boolean = false, page: number): void => {
            this.markAsLoading(scopeContent);
            if (true === triggeredBySearch) {
                scopeContent.currentPage = page = 1;
            }
            this.changePage(scopeContent, page || 1);
        };

        // receive initial data
        scopeContent.pageChanged();

        let searchDelay: ng.IPromise<any>;
        let oldValue: string;
        $scope.$watch('dataTable.searchValue', (newValue: string) => {
            if (searchDelay !== undefined) {
                this.$timeout.cancel(searchDelay);
            }
            searchDelay = this.$timeout(() => {
                if (
                    this.hasSearch(scopeContent) ||
                    (true === this.hasSearchMinValue(oldValue) && false === this.hasSearchMinValue(newValue))
                ) {
                    scopeContent.pageChanged(true, scopeContent.currentPage);
                }
                oldValue = newValue;
            }, 300);
        });

        $scope.$on(EVENT_REFRESH_DATA_TABLE_PREFIX + scopeContent.uniqueKey, (event, payload) => {
            let page: number = (payload && 0 < payload.page) ? payload.page : scopeContent.currentPage;

            this.markAsLoading(scopeContent);
            this.changePage(scopeContent, page);
        });

        $scope.$on('destroy', () => {
            this.$timeout.cancel(searchDelay);
        });
    }

    private markAsLoading (scope: IDataTableScopeContent, asLoading: boolean = true): void {
        scope.isLoading = asLoading;
        asLoading
            ? this.usSpinnerService.spin(scope.uniqueKey)
            : this.usSpinnerService.stop(scope.uniqueKey);
    }

    private changePage (scopeContent: IDataTableScopeContent, page: number): void {
        let additionalQueryParameters = {};
        angular.extend(additionalQueryParameters, scopeContent.additionalQueryParameters);
        this.service.getAll(
            this.service.getSorting(),
            this.service.getLimit(),
            (page - 1) * this.service.getLimit(),
            this.hasSearch(scopeContent) ? scopeContent.searchValue : '',
            additionalQueryParameters
        ).then(
            (payload: IDataTableResponse<any>) => {
                scopeContent.data = payload;
                scopeContent.totalItems = payload.recordsTotal;
            }
        ).finally(() => {
            this.markAsLoading(scopeContent, false);
            this.$scope.$emit(EVENT_PAGE_CHANGED_DATA_TABLE);
        });
    }

    private hasSearch (scopeContent: IDataTableScopeContent) {
        return scopeContent.isSearchAllowed && this.hasSearchMinValue(scopeContent.searchValue);
    }

    private hasSearchMinValue (search: string) {
        return !!search && search.length > 2
    }

    private create () {
        let directive: ng.IDirective = {
            bindToController: true,
            controller: ['$scope', ($scope: IDataTableScope) => this.controller($scope)],
            controllerAs: 'dataTable',
            link: ($scope: IDataTableScope, elem: ng.IAugmentedJQuery) => this.linkFn($scope, elem),
            restrict: 'E',
            scope: {
                additionalQueryParameters: '=queryParameters',
                data: '=data',
                isSearchAllowed: '=?search',
                serviceName: '@service',
                uniqueKey: '@uniqueKey',
            },
            templateUrl: 'datatable.directive.html',
            transclude: true,
        };

        return <any>directive;
    }
}

angular.module('rocket-grid-datatable').directive('rocketGridDatatable', [
    '$injector',
    '$timeout',
    'usSpinnerService',
    (
        $injector: ng.auto.IInjectorService,
        $timeout: ng.ITimeoutService,
        usSpinnerService: ISpinnerService
    ) => new DataTableDirective($injector, $timeout, usSpinnerService)
]);
