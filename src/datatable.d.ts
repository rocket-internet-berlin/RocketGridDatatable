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
        getSorting(): IGetAllSortingParameter;
        getLimit(): number;
        getOffset(): number;
        getSearch(): string;

        removeSorting(columnName: string): void;
        addSorting(columnName: string, direction: string): void;
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
