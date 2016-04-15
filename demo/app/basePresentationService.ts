const DEFAULT_OFFSET = 0;

export default class BasePresentationService implements angularGridDatatable.IPresentationService {
    public items: ng.IPromise<angularGridDatatable.IDataTableResponse<any>>;
    public service: angularGridDatatable.IDataTableService;

    private limit: number;
    private offset: number = DEFAULT_OFFSET;
    private sorting: angularGridDatatable.IGetAllSortingParameter = [];

    public constructor (paginationLimitPerPage: number) {
        this.limit = paginationLimitPerPage;
        this.sorting = this.getDefaultSorting();
    }

    public getAll (
        sorting: angularGridDatatable.IGetAllSortingParameter,
        limit: number,
        offset: number,
        additionalQueryParameters: {}
    ): ng.IPromise<angularGridDatatable.IDataTableResponse<any>> {
        this.setSorting(sorting);
        this.setLimit(limit);
        this.setOffset(offset);

        this.items = this.service.getAll(
            this.getSorting(),
            this.getLimit(),
            this.getOffset(),
            additionalQueryParameters
        );

        return this.items;
    }

    public addSorting (columnName: string, direction: 'asc' | 'desc'): void {
        this.removeSorting(columnName);
        let newSorting: angularGridDatatable.ISortingParameter = {
            column: columnName,
            direction: direction,
        };

        let sorting: angularGridDatatable.IGetAllSortingParameter = this.getSorting();
        sorting.push(newSorting);

        this.setSorting(sorting);
    }

    public removeSorting (columnName: string): void {
        let newSorting = <angularGridDatatable.IGetAllSortingParameter>this.getSorting().filter(
            (sortingParam: angularGridDatatable.ISortingParameter) => sortingParam.column !== columnName
        );

        this.setSorting(newSorting);
    }

    public getDefaultSorting (): angularGridDatatable.IGetAllSortingParameter {
        return [];
    }

    public getSorting (): angularGridDatatable.IGetAllSortingParameter {
        return this.sorting;
    }

    public getLimit (): number {
        return this.limit;
    }

    public getOffset (): number {
        return 0 < this.offset ? this.offset : DEFAULT_OFFSET;
    }

    private setSorting (sorting: angularGridDatatable.IGetAllSortingParameter): void {
        this.sorting = sorting;
    }

    private setLimit (limit: number): void {
        this.limit = limit;
    }

    private setOffset (offset: number): void {
        this.offset = offset;
    }
}
