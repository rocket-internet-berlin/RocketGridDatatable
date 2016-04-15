const DEFAULT_OFFSET = 0;

export default class BasePresentationService implements rocketGridDatatable.IPresentationService {
    public items: ng.IPromise<rocketGridDatatable.IDataTableResponse<any>>;
    public service: rocketGridDatatable.IDataTableService;

    private limit: number;
    private offset: number = DEFAULT_OFFSET;
    private search: string;
    private sorting: rocketGridDatatable.IGetAllSortingParameter = [];

    public constructor (paginationLimitPerPage: number) {
        this.limit = paginationLimitPerPage;
        this.sorting = this.getDefaultSorting();
    }

    public getAll (
        sorting: rocketGridDatatable.IGetAllSortingParameter,
        limit: number,
        offset: number,
        search: string,
        additionalQueryParameters: {}
    ): ng.IPromise<rocketGridDatatable.IDataTableResponse<any>> {
        this.setSearch(search);
        this.setSorting(sorting);
        this.setLimit(limit);
        this.setOffset(offset);

        this.items = this.service.getAll(
            this.getSorting(),
            this.getLimit(),
            this.getOffset(),
            this.getSearch(),
            additionalQueryParameters
        );

        return this.items;
    }

    public addSorting (columnName: string, direction: 'asc' | 'desc'): void {
        this.removeSorting(columnName);
        let newSorting: rocketGridDatatable.ISortingParameter = {
            column: columnName,
            direction: direction,
        };

        let sorting: rocketGridDatatable.IGetAllSortingParameter = this.getSorting();
        sorting.push(newSorting);

        this.setSorting(sorting);
    }

    public removeSorting (columnName: string): void {
        let newSorting = <rocketGridDatatable.IGetAllSortingParameter>this.getSorting().filter(
            (sortingParam: rocketGridDatatable.ISortingParameter) => sortingParam.column !== columnName
        );

        this.setSorting(newSorting);
    }

    public getDefaultSorting (): rocketGridDatatable.IGetAllSortingParameter {
        return [];
    }

    public getSearch (): string {
        return this.search;
    }

    public getSorting (): rocketGridDatatable.IGetAllSortingParameter {
        return this.sorting;
    }

    public getLimit (): number {
        return this.limit;
    }

    public getOffset (): number {
        return 0 < this.offset ? this.offset : DEFAULT_OFFSET;
    }

    private setSearch (search: string): void {
        this.search = search;
    }

    private setSorting (sorting: rocketGridDatatable.IGetAllSortingParameter): void {
        this.sorting = sorting;
    }

    private setLimit (limit: number): void {
        this.limit = limit;
    }

    private setOffset (offset: number): void {
        this.offset = offset;
    }
}
