/// <reference path="./../../typings/main.d.ts" />
'use strict';

import UserService from './usersService';

import UserPresentationService from './usersPresentationService';

import {EVENT_PAGE_CHANGED_DATA_TABLE} from '../../dist/events';

let datatableDemoApplication = angular.module('datatableDemo', [
    'rocket-grid-datatable',
]);
datatableDemoApplication.constant('paginationLimitPerPage', 5);
datatableDemoApplication.service('UserService', UserService);
datatableDemoApplication.service('UsersPresentationService', UserPresentationService);
datatableDemoApplication.controller('DemoCtrl', ($scope: ng.IScope) => {
    $scope.$on(EVENT_PAGE_CHANGED_DATA_TABLE, () => console.log('ctrl: page was changed'));
});
