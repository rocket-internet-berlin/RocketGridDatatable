# Rocket Grid Datatable
AngularJS directive adds interaction controls as server side pagination, search and sorting to you tables.

## Contributing
Everyone is more than welcome to contribute. Please do not forget on each change to recreate and commit dist folder.
To do that please run `npm run build`.

**How to build dist:**

  - `npm install`
  - `npm run build`

## Implementation
Implementation details are written for the project using typescript. You can use this directive also with
the pure AngularJS project without any compiler. *But typescript can save you a lot of time :)*

For concrete implementation you can see demo application in *demo* folder.


**Step 1:**

Install the directive by `bower` or `npm`.

`bower install --save rocket-grid-datatable` or `npm install --save rocket-grid-datatable`


**Step 2:**

Put it as dependency or to your build process:

```html
    ...
    <link rel="stylesheet" type="text/css" href="__PATH__/dist/rocket-grid-datatable.min.css">
</head>
<body>
    ...
    <script src="__PATH__/dist/rocket-grid-datatable.min.js"></script>
</body>
```


**Step 3:**

Add directive as dependency:

```javascript
let yourApp = angular.module('YOUR_APP_NAME', [
    ...
    'rocket-grid-datatable',
]);
```


**Step 4:**

Add presentation service extending from `BasePresentationService` provided in `./dist` folder.

Responsibility of the service is:

  - create dependency on you repository service (service which handles data read - from DB, cache or other storage)
  - define limit per pagination
  - define default sorting

*Example:*

```javascript
'use strict';

import { BasePresentationService } from '__PATH_TO_DIRECTIVE__/dist/basePresentationService';

const PAGINATION_LIMIT_PER_PAGE = 5;

export default class UserPresentationService extends BasePresentationService {
    static $inject: string[] = [
        'UserService', // <-- this is dependent service
    ];

    constructor (service: rocketGridDatatable.IDataTableService) {
        super(PAGINATION_LIMIT_PER_PAGE); // <-- this is pagination limit

        this.service = service;
    }

    public getDefaultSorting (): rocketGridDatatable.IGetAllSortingParameter {
        return [{ column: 'email', direction: 'asc' }]; // <-- this is default sorting
    }
}
```


**Step 5:**

Create a kind of repository service which implements `rocketGridDatatable.IDataTableService`.

*Example:*

```javascript
'use strict';

export default class UserService implements rocketGridDatatable.IDataTableService {
    static $inject: string[] = [
        '$resource',
    ];

    constructor(private $resource: ng.IResourceService) {}

    public getAll (
        sorting: rocketGridDatatable.IGetAllSortingParameter,
        limit: number,
        offset: number,
        search: string,
        additionalQueryParameters: {}
    ): ng.IPromise<rocketGridDatatable.IDataTableResponse<any>> {
        let users = this.$resource('api_url').get(
            angular.extend({
                limit: limit,
                offset: offset,
                search: search,
                'sort[]': sorting,
            }, additionalQueryParameters)
        );

        return users.$promise;
    }
}
```


**Additional info:**

You can listen in your controller and make other actions after each page change.

*Example:*

```javascript
yourApp.controller('DemoCtrl', ($scope: ng.IScope) => {
    $scope.$on(EVENT_PAGE_CHANGED_DATA_TABLE, () => console.log('Ctrl: data in datatable were changed.'));
});
```
