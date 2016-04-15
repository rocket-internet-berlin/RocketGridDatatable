declare module angularGridDatatable {
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

    export interface IDataTableService {
        getAll(
            sort: IGetAllSortingParameter,
            limit: number,
            offset: number,
            additionalQueryParameters: {}
        ): ng.IPromise<any>;
    }

    export interface IPresentationService {
        getAll(
            sort: IGetAllSortingParameter,
            limit: number,
            offset: number,
            additionalQueryParameters: {}
        );

        getSorting(): IGetAllSortingParameter;
        getLimit(): number;
        getOffset(): number;

        removeSorting(columnName: string): void;
        addSorting(columnName: string, direction: string): void;
    }
}
