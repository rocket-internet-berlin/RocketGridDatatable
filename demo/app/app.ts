/// <reference path="./../../typings/tsd.d.ts" />
'use strict';

import UserService from './usersService';

import UserPresentationService from './usersPresentationService';

let datatableDemoApplication = angular.module('datatableDemo', [
    'angular-grid-datatable',
]);
datatableDemoApplication.constant('paginationLimitPerPage', 5);
datatableDemoApplication.service('UserService', UserService);
datatableDemoApplication.service('UsersPresentationService', UserPresentationService);
datatableDemoApplication.controller('DemoCtrl', ($scope: ng.IScope) => {
    $scope.$on('datatable-page-changed', () => console.log('ctrl: page was changed'));
});
