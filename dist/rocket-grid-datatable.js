(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
exports.EVENT_REFRESH_DATA_TABLE_PREFIX = 'datatable-refresh-';
exports.EVENT_PAGE_CHANGED_DATA_TABLE = 'datatable-page-changed';

},{}],2:[function(require,module,exports){
'use strict';
var events_1 = require('../dist/events');
var datatable_helper_1 = require('./datatable.helper');
var DataTableDirective = (function () {
    function DataTableDirective($injector, $timeout, usSpinnerService) {
        this.$injector = $injector;
        this.$timeout = $timeout;
        this.usSpinnerService = usSpinnerService;
        return this.create();
    }
    DataTableDirective.prototype.linkFn = function ($scope, elem) {
        var sortableColumns = elem.find('.grid-datatable table thead th[data-sort]');
        (new datatable_helper_1.DataTableSortingHelper(sortableColumns, this.service, $scope.dataTable.pageChanged)).initSorting();
    };
    DataTableDirective.prototype.controller = function ($scope) {
        var _this = this;
        this.$scope = $scope;
        var scopeContent = $scope.dataTable;
        scopeContent.isSearchAllowed = !!scopeContent.isSearchAllowed;
        scopeContent.searchValue = '';
        this.service = this.$injector.get(scopeContent.serviceName + 'PresentationService');
        scopeContent.uniqueKey = scopeContent.uniqueKey || Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 6);
        scopeContent.currentPage = 1;
        scopeContent.itemsPerPage = this.service.getLimit();
        scopeContent.pageChanged = function (triggeredBySearch, page) {
            if (triggeredBySearch === void 0) { triggeredBySearch = false; }
            _this.markAsLoading(scopeContent);
            if (true === triggeredBySearch) {
                scopeContent.currentPage = page = 1;
            }
            _this.changePage(scopeContent, page || 1);
        };
        // receive initial data
        scopeContent.pageChanged();
        var searchDelay;
        var oldValue;
        $scope.$watch('dataTable.searchValue', function (newValue) {
            if (searchDelay !== undefined) {
                _this.$timeout.cancel(searchDelay);
            }
            searchDelay = _this.$timeout(function () {
                if (_this.hasSearch(scopeContent) ||
                    (true === _this.hasSearchMinValue(oldValue) && false === _this.hasSearchMinValue(newValue))) {
                    scopeContent.pageChanged(true, scopeContent.currentPage);
                }
                oldValue = newValue;
            }, 300);
        });
        $scope.$on(events_1.EVENT_REFRESH_DATA_TABLE_PREFIX + scopeContent.uniqueKey, function (event, payload) {
            var page = (payload && 0 < payload.page) ? payload.page : scopeContent.currentPage;
            _this.markAsLoading(scopeContent);
            _this.changePage(scopeContent, page);
        });
        $scope.$on('destroy', function () {
            _this.$timeout.cancel(searchDelay);
        });
    };
    DataTableDirective.prototype.markAsLoading = function (scope, asLoading) {
        if (asLoading === void 0) { asLoading = true; }
        scope.isLoading = asLoading;
        asLoading
            ? this.usSpinnerService.spin(scope.uniqueKey)
            : this.usSpinnerService.stop(scope.uniqueKey);
    };
    DataTableDirective.prototype.changePage = function (scopeContent, page) {
        var _this = this;
        var additionalQueryParameters = {};
        angular.extend(additionalQueryParameters, scopeContent.additionalQueryParameters);
        this.service.getAll(this.service.getSorting(), this.service.getLimit(), (page - 1) * this.service.getLimit(), this.hasSearch(scopeContent) ? scopeContent.searchValue : '', additionalQueryParameters).then(function (payload) {
            scopeContent.data = payload;
            scopeContent.totalItems = payload.recordsTotal;
        }).finally(function () {
            _this.markAsLoading(scopeContent, false);
            _this.$scope.$emit(events_1.EVENT_PAGE_CHANGED_DATA_TABLE);
        });
    };
    DataTableDirective.prototype.hasSearch = function (scopeContent) {
        return scopeContent.isSearchAllowed && this.hasSearchMinValue(scopeContent.searchValue);
    };
    DataTableDirective.prototype.hasSearchMinValue = function (search) {
        return !!search && search.length > 2;
    };
    DataTableDirective.prototype.create = function () {
        var _this = this;
        var directive = {
            bindToController: true,
            controller: ['$scope', function ($scope) { return _this.controller($scope); }],
            controllerAs: 'dataTable',
            link: function ($scope, elem) { return _this.linkFn($scope, elem); },
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
        return directive;
    };
    return DataTableDirective;
}());
angular.module('rocket-grid-datatable').directive('rocketGridDatatable', [
    '$injector',
    '$timeout',
    'usSpinnerService',
    function ($injector, $timeout, usSpinnerService) {
        return new DataTableDirective($injector, $timeout, usSpinnerService);
    }
]);

},{"../dist/events":1,"./datatable.helper":3}],3:[function(require,module,exports){
'use strict';
var ASCENDING = 'asc';
var DESCENDING = 'desc';
var SORTABLE_CLASS = 'sortable';
var SORTABLE_CLASS_ASCENDING = 'sortable-' + ASCENDING;
var SORTABLE_CLASS_DESCENDING = 'sortable-' + DESCENDING;
/**
 * @description
 * # DataTableSortingHelper
 */
var DataTableSortingHelper = (function () {
    function DataTableSortingHelper(sortableColumns, service, pageChangeCallback) {
        this.sortableColumns = sortableColumns;
        this.service = service;
        this.pageChangeCallback = pageChangeCallback;
    }
    DataTableSortingHelper.prototype.initSorting = function () {
        var _this = this;
        if (0 === this.sortableColumns.length) {
            return;
        }
        this.sortableColumns.each(function (index, elem) {
            var column = angular.element(elem);
            column.addClass(SORTABLE_CLASS).on('click', function (event) {
                event.preventDefault();
                _this.updateClasses(angular.element(event.target));
                _this.pageChangeCallback();
            });
            _this.service.getSorting().forEach(function (sortingElement) {
                if (sortingElement.column === column.data('sort')) {
                    column.addClass(sortingElement.direction === ASCENDING ? SORTABLE_CLASS_ASCENDING : SORTABLE_CLASS_DESCENDING);
                }
            });
        });
    };
    DataTableSortingHelper.prototype.updateClasses = function (th) {
        var _this = this;
        var columnName = th.data('sort');
        // we need to remove all other sorting before proceeding
        th.parent()
            .find('th')
            .filter(function (index, elem) { return elem !== th.get(0); })
            .each(function (index, elem) {
            _this.service.removeSorting(angular.element(elem).data('sort'));
            angular.element(elem).removeClass(SORTABLE_CLASS_ASCENDING);
            angular.element(elem).removeClass(SORTABLE_CLASS_DESCENDING);
        });
        if (th.hasClass(SORTABLE_CLASS_ASCENDING)) {
            this.service.addSorting(columnName, DESCENDING);
            th.removeClass(SORTABLE_CLASS_ASCENDING);
            th.addClass(SORTABLE_CLASS_DESCENDING);
        }
        else if (th.hasClass(SORTABLE_CLASS_DESCENDING)) {
            this.service.removeSorting(columnName);
            th.removeClass(SORTABLE_CLASS_DESCENDING);
        }
        else {
            this.service.addSorting(columnName, ASCENDING);
            th.addClass(SORTABLE_CLASS_ASCENDING);
        }
    };
    return DataTableSortingHelper;
}());
exports.DataTableSortingHelper = DataTableSortingHelper;

},{}],4:[function(require,module,exports){
'use strict';
angular.module('rocket-grid-datatable', [
    'angularSpinner',
    'bw.paging'
]);

},{}],5:[function(require,module,exports){
var module;
try {
  module = angular.module('rocket-grid-datatable');
} catch (e) {
  module = angular.module('rocket-grid-datatable', []);
}

module.run(['$templateCache', function ($templateCache) {
  $templateCache.put('datatable.directive.html',
    '<div ng-show="dataTable.isLoading" class="transparent-cover"></div>\n' +
    '\n' +
    '<span us-spinner data-spinner-key="{{dataTable.uniqueKey}}"></span>\n' +
    '\n' +
    '<div class="grid-datatable grid-datatable__search" data-ng-show="true === dataTable.isSearchAllowed">\n' +
    '    <label>\n' +
    '        Search: <input class="grid-datatable__search__box" ng-model="dataTable.searchValue" type="text">\n' +
    '    </label>\n' +
    '</div>\n' +
    '<div class="grid-datatable" ng-transclude></div>\n' +
    '\n' +
    '<paging class="pull-right"\n' +
    '        data-page="dataTable.currentPage"\n' +
    '        data-paging-action="dataTable.pageChanged(false, page)"\n' +
    '        data-page-size="dataTable.itemsPerPage"\n' +
    '        data-total="dataTable.totalItems"\n' +
    '        data-adjacent="1"\n' +
    '        data-show-prev-next="true"\n' +
    '        data-text-prev="Previous"\n' +
    '        data-text-next="Next"\n' +
    '        data-show-boundary-links="false"></paging>\n' +
    '\n' +
    '<div class="clearfix"></div>\n' +
    '\n' +
    '');
}]);


},{}]},{},[1,4,3,2,5]);
