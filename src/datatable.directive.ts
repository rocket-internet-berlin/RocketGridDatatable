'use strict';

import { DataTableSortingHelper } from './datatable.helper';

export const EVENT_REFRESH_DATA_TABLE_PREFIX: string = 'datatable-refresh-';
export const EVENT_PAGE_CHANGED_DATA_TABLE: string = 'datatable-page-changed';

interface IDataTableScopeContent {
    $promise: ng.IPromise<any>;
    $resolved: boolean;

    // initial scope
    additionalQueryParameters: {};
    data: angularGridDatatable.IDataTableResponse<any>;
    serviceName: string;

    // other scope properties
    isLoading: boolean;
    uniqueKey: string;

    // data pagination
    pageChanged: (page?: number) => void;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
}

interface IDataTableScope extends ng.IScope {
    scxDataTable: IDataTableScopeContent;
}

class DataTableDirective implements ng.IDirective {
    private service: angularGridDatatable.IPresentationService;
    private $scope: IDataTableScope;

    constructor (
        protected $injector: ng.auto.IInjectorService,
        protected usSpinnerService: ISpinnerService
    ) {
        return this.create();
    }

    public linkFn ($scope: IDataTableScope, elem: ng.IAugmentedJQuery): void {
        let sortableColumns = elem.find('.angular-grid-datatable table thead th[data-sort]');

        (new DataTableSortingHelper(
            sortableColumns,
            this.service,
            $scope.scxDataTable.pageChanged
        )).initSorting();
    }

    public controller ($scope: IDataTableScope): void {
        this.$scope = $scope;
        let scopeContent: IDataTableScopeContent = $scope.scxDataTable;

        this.service = <any>this.$injector.get(scopeContent.serviceName + 'PresentationService');
        scopeContent.uniqueKey = scopeContent.uniqueKey || Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 6);
        scopeContent.currentPage = 1;
        scopeContent.itemsPerPage = this.service.getLimit();
        scopeContent.pageChanged = (page: number): void => {
            this.markAsLoading(scopeContent);
            this.changePage(scopeContent, page);
        };

        // receive initial data
        scopeContent.pageChanged();

        $scope.$on(EVENT_REFRESH_DATA_TABLE_PREFIX + scopeContent.uniqueKey, (event, payload) => {
            let page: number = (payload && 0 < payload.page) ? payload.page : scopeContent.currentPage;

            this.markAsLoading(scopeContent);
            this.changePage(scopeContent, page);
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
            additionalQueryParameters
        ).then(
            (payload: angularGridDatatable.IDataTableResponse<any>) => {
                scopeContent.data = payload;
                scopeContent.totalItems = payload.recordsTotal;
            }
        ).finally(() => {
            this.markAsLoading(scopeContent, false);
            this.$scope.$emit(EVENT_PAGE_CHANGED_DATA_TABLE);
        });
    }

    private create () {
        let directive: ng.IDirective = {
            bindToController: true,
            controller: ['$scope', ($scope: IDataTableScope) => this.controller($scope)],
            controllerAs: 'scxDataTable',
            link: ($scope: IDataTableScope, elem: ng.IAugmentedJQuery) => this.linkFn($scope, elem),
            restrict: 'E',
            scope: {
                additionalQueryParameters: '=queryParameters',
                data: '=data',
                serviceName: '@service',
                uniqueKey: '@uniqueKey',
            },
            templateUrl: 'datatable.directive.html',
            transclude: true,
        };

        return <any>directive;
    }
}

angular.module('angular-grid-datatable').directive('angularGridDatatable', [
    '$injector',
    'usSpinnerService',
    (
        $injector: ng.auto.IInjectorService,
        usSpinnerService: ISpinnerService
    ) => new DataTableDirective($injector, usSpinnerService)
]);
