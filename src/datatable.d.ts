declare module rocketGridDatatable {
    export interface IDataTableService {
        getAll(
            sort: IGetAllSortingParameter,
            limit: number,
            offset: number,
            search: string,
            additionalQueryParameters: {}
        ): ng.IPromise<IDataTableResponse<any>>;
    }

    export interface IPresentationService extends IDataTableService {
        getAll(
            sort: IGetAllSortingParameter,
            limit: number,
            offset: number,
            search: string,
            additionalQueryParameters: {}
        ): ng.IPromise<IDataTableResponse<any>>;

        getDefaultSorting(): IGetAllSortingParameter;

        getSorting(): IGetAllSortingParameter;
        getLimit(): number;
        getOffset(): number;
        getSearch(): string;

        addSorting(columnName: string, direction: 'asc' | 'desc'): void;
        removeSorting(columnName: string): void;
    }

    export interface IDataTableResponse<T> {
        items: T[];
        recordsTotal: number;
        offset: number;
        limit: number;
    }

    export interface ISortingParameter {
        column: string;
        direction: 'asc' | 'desc';
    }

    export interface IGetAllSortingParameter extends Array<ISortingParameter> {}
}
