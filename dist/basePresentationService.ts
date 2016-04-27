const DEFAULT_OFFSET = 0;

import {
    IPresentationService,
    IDataTableResponse,
    IDataTableService,
    ISortingParameter,
    IGetAllSortingParameter
} from 'rocketGridDatatable';

export class BasePresentationService implements IPresentationService {
    public items: ng.IPromise<IDataTableResponse<any>>;
    public service: IDataTableService;

    private limit: number;
    private offset: number = DEFAULT_OFFSET;
    private search: string;
    private sorting: IGetAllSortingParameter = [];

    public constructor (paginationLimitPerPage: number) {
        this.limit = paginationLimitPerPage;
        this.sorting = this.getDefaultSorting();
    }

    public getAll (
        sorting: IGetAllSortingParameter,
        limit: number,
        offset: number,
        search: string,
        additionalQueryParameters: {}
    ): ng.IPromise<IDataTableResponse<any>> {
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
        let newSorting: ISortingParameter = {
            column: columnName,
            direction: direction,
        };

        let sorting: IGetAllSortingParameter = this.getSorting();
        sorting.push(newSorting);

        this.setSorting(sorting);
    }

    public removeSorting (columnName: string): void {
        let newSorting = <IGetAllSortingParameter>this.getSorting().filter(
            (sortingParam: ISortingParameter) => sortingParam.column !== columnName
        );

        this.setSorting(newSorting);
    }

    public getDefaultSorting (): IGetAllSortingParameter {
        return [];
    }

    public getSearch (): string {
        return this.search;
    }

    public getSorting (): IGetAllSortingParameter {
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

    private setSorting (sorting: IGetAllSortingParameter): void {
        this.sorting = sorting;
    }

    private setLimit (limit: number): void {
        this.limit = limit;
    }

    private setOffset (offset: number): void {
        this.offset = offset;
    }
}
