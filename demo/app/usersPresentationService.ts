'use strict';

import BasePresentationService from './basePresentationService';

export default class UserPresentationService extends BasePresentationService {
    static $inject: string[] = [
        'paginationLimitPerPage',
        'UserService',
    ];

    static defaultSorting: Array<rocketGridDatatable.ISortingParameter> = [
        {
            column: 'email',
            direction: 'asc',
        },
    ];

    constructor (paginationLimitPerPage: number, service: rocketGridDatatable.IDataTableService) {
        super(paginationLimitPerPage);

        this.service = service;
    }

    public getDefaultSorting (): rocketGridDatatable.IGetAllSortingParameter {
        return UserPresentationService.defaultSorting;
    }
}
