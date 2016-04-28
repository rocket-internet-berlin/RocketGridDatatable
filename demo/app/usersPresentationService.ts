'use strict';

import {
    IDataTableService,
    IGetAllSortingParameter,
    ISortingParameter
} from 'rocketGridDatatable';

import { BasePresentationService } from '../../dist/basePresentationService';

export default class UserPresentationService extends BasePresentationService {
    static $inject: string[] = [
        'paginationLimitPerPage',
        'UserService',
    ];

    constructor (paginationLimitPerPage: number, service: IDataTableService) {
        super(paginationLimitPerPage);

        this.service = service;
    }

    public getDefaultSorting (): IGetAllSortingParameter {
        return [
            {
                column: 'email',
                direction: 'asc',
            },
        ];
    }
}
