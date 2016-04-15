/// <reference path="./../../typings/main.d.ts" />
'use strict';

import UserService from './usersService';

import UserPresentationService from './usersPresentationService';

let datatableDemoApplication = angular.module('datatableDemo', [
    'rocket-grid-datatable',
]);
datatableDemoApplication.constant('paginationLimitPerPage', 5);
datatableDemoApplication.service('UserService', UserService);
datatableDemoApplication.service('UsersPresentationService', UserPresentationService);
datatableDemoApplication.controller('DemoCtrl', ($scope: ng.IScope) => {
    $scope.$on('datatable-page-changed', () => console.log('ctrl: page was changed'));
});
