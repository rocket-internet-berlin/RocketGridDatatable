'use strict';

import BasePresentationService from './basePresentationService';

export default class UserPresentationService extends BasePresentationService {
    static $inject: string[] = [
        'paginationLimitPerPage',
        'UserService',
    ];

    static defaultSorting: Array<angularGridDatatable.ISortingParameter> = [
        {
            column: 'email',
            direction: 'asc',
        },
    ];

    constructor (paginationLimitPerPage: number, service: angularGridDatatable.IDataTableService) {
        super(paginationLimitPerPage);

        this.service = service;
    }

    public getDefaultSorting (): angularGridDatatable.IGetAllSortingParameter {
        return UserPresentationService.defaultSorting;
    }
}
