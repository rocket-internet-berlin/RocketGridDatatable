'use strict';

export default class UserService implements rocketGridDatatable.IDataTableService {
    static $inject: string[] = [
        '$q',
        '$filter',
    ];

    private users = [
        {name: 'Fannie', lastName: 'Carlson'},
        {name: 'Derek', lastName: 'Jackson'},
        {name: 'Vivian', lastName: 'Knight'},
        {name: 'Ken', lastName: 'Garcia'},
        {name: 'Viola', lastName: 'Walton'},
        {name: 'Allison', lastName: 'Perkins'},
        {name: 'Beth', lastName: 'Harris'},
        {name: 'Holly', lastName: 'Kelly'},
        {name: 'Gregg', lastName: 'Walters'},
        {name: 'Pam', lastName: 'Henry'},
        {name: 'Tricia', lastName: 'Frazier'},
        {name: 'Percy', lastName: 'Colon'},
        {name: 'Sheryl', lastName: 'Roberson'},
        {name: 'Theresa', lastName: 'Martinez'},
        {name: 'Georgia', lastName: 'Buchanan'},
        {name: 'Sophie', lastName: 'Black'},
        {name: 'Darrell', lastName: 'Pratt'},
        {name: 'Josh', lastName: 'Garrett'},
        {name: 'Luis', lastName: 'Figueroa'},
        {name: 'Lillie', lastName: 'Stewart'},
        {name: 'Mercedes', lastName: 'Obrien'},
        {name: 'Ollie', lastName: 'Edwards'},
        {name: 'Misty', lastName: 'Burke'},
        {name: 'Jacob', lastName: 'Franklin'},
        {name: 'Ralph', lastName: 'Elliott'},
        {name: 'Becky', lastName: 'Bradley'},
        {name: 'Chris', lastName: 'Olson'},
        {name: 'Lloyd', lastName: 'Richards'},
        {name: 'Mildred', lastName: 'Richardson'},
        {name: 'Amanda', lastName: 'Holland'},
        {name: 'Aaron', lastName: 'Benson'},
        {name: 'Debra', lastName: 'Caldwell'},
        {name: 'Mitchell', lastName: 'Ramirez'},
        {name: 'Roman', lastName: 'Vasquez'},
        {name: 'Cedric', lastName: 'Williams'},
        {name: 'Lela', lastName: 'Moss'},
        {name: 'Rolando', lastName: 'Roberts'},
        {name: 'Micheal', lastName: 'Barker'},
        {name: 'Donnie', lastName: 'Garza'},
        {name: 'Clayton', lastName: 'Collier'},
        {name: 'Paula', lastName: 'Schwartz'},
        {name: 'Larry', lastName: 'Harrington'},
        {name: 'Cesar', lastName: 'Dean'},
        {name: 'Heather', lastName: 'Sutton'},
        {name: 'Hazel', lastName: 'Waters'},
        {name: 'Vicki', lastName: 'Fields'},
        {name: 'Boyd', lastName: 'Chandler'},
        {name: 'Clarence', lastName: 'Greene'},
        {name: 'Francisco', lastName: 'Tuckern'},
        {name: 'Yvette', lastName: 'Masonn'}
    ];

    constructor(private $q: ng.IQService, private $filter: ng.IFilterService) {}

    public getAll (
        sorting: rocketGridDatatable.IGetAllSortingParameter,
        limit: number,
        offset: number,
        search: string,
        additionalQueryParameters: {}
    ): ng.IPromise<rocketGridDatatable.IDataTableResponse<any>> {
        let items: any[] = (search) ? this.$filter('filter')(this.users, search) : this.users;
        let total = items.length;

        items = (<any>Array(Math.min(limit, total))).fill(0).map((item, i: number): any => {
            return items[i + offset];
        });

        let result: rocketGridDatatable.IDataTableResponse<any> = {
            items: items,
            recordsTotal: total,
            offset: offset,
            limit: limit
        };

        let deferred = this.$q.defer();
        deferred.resolve(result);

        return deferred.promise;
    }
}
