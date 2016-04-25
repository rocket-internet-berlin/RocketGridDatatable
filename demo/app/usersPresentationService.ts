'use strict';

import { BasePresentationService } from '../../dist/basePresentationService';

export default class UserPresentationService extends BasePresentationService {
    static $inject: string[] = [
        'paginationLimitPerPage',
        'UserService',
    ];

    constructor (paginationLimitPerPage: number, service: rocketGridDatatable.IDataTableService) {
        super(paginationLimitPerPage);

        this.service = service;
    }

    public getDefaultSorting (): rocketGridDatatable.IGetAllSortingParameter {
        return [
            {
                column: 'email',
                direction: 'asc',
            },
        ];
    }
}
