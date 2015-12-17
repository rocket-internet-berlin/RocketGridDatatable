'use strict';

export default class UserService implements angularGridDatatable.IDataTableService {
    static $inject: string[] = [
        '$q',
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

    constructor(private $q: ng.IQService) {}

    public getAll (
        sorting: angularGridDatatable.IGetAllSortingParameter,
        limit: number,
        offset: number,
        additionalQueryParameters: {}
    ): ng.IPromise<angularGridDatatable.IDataTableResponse<any>> {
        let result: angularGridDatatable.IDataTableResponse<any> = {
            items: (<any>Array(limit)).fill(0).map((item, i) => this.users[i + offset]),
            recordsTotal: this.users.length,
            offset: offset,
            limit: limit
        };

        let deferred = this.$q.defer();
        deferred.resolve(result);

        return deferred.promise;
    }
}
