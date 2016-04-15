'use strict';

const ASCENDING: string = 'asc';
const DESCENDING: string = 'desc';
const SORTABLE_CLASS: string = 'sortable';
const SORTABLE_CLASS_ASCENDING: string = 'sortable-' + ASCENDING;
const SORTABLE_CLASS_DESCENDING: string = 'sortable-' + DESCENDING;

/**
 * @description
 * # DataTableSortingHelper
 */
export class DataTableSortingHelper {
    constructor (
        protected sortableColumns: ng.IAugmentedJQuery,
        protected service: rocketGridDatatable.IPresentationService,
        protected pageChangeCallback: Function
    ) {}

    public initSorting (): void {
        if (0 === this.sortableColumns.length) {
            return;
        }

        this.sortableColumns.each((index: number, elem: Element) => {
            let column = angular.element(elem);

            column.addClass(SORTABLE_CLASS).on('click', (event: JQueryEventObject) => {
                event.preventDefault();
                this.updateClasses(angular.element(event.target));
                this.pageChangeCallback();
            });

            this.service.getSorting().forEach((sortingElement: rocketGridDatatable.ISortingParameter) => {
                if (sortingElement.column === column.data('sort')) {
                    column.addClass(
                        sortingElement.direction === ASCENDING
                            ? SORTABLE_CLASS_ASCENDING
                            : SORTABLE_CLASS_DESCENDING
                    );
                }
            });
        });
    }

    private updateClasses (th: ng.IAugmentedJQuery): void {
        let columnName: string = th.data('sort');

        // we need to remove all other sorting before proceeding
        th.parent()
            .find('th')
            .filter((index: number, elem: Element) => elem !== th.get(0))
            .each((index: number, elem: Element) => {
                this.service.removeSorting(angular.element(elem).data('sort'));
                angular.element(elem).removeClass(SORTABLE_CLASS_ASCENDING);
                angular.element(elem).removeClass(SORTABLE_CLASS_DESCENDING);
            });

        if (th.hasClass(SORTABLE_CLASS_ASCENDING)) {
            this.service.addSorting(columnName, DESCENDING);
            th.removeClass(SORTABLE_CLASS_ASCENDING);
            th.addClass(SORTABLE_CLASS_DESCENDING);
        } else if (th.hasClass(SORTABLE_CLASS_DESCENDING)) {
            this.service.removeSorting(columnName);
            th.removeClass(SORTABLE_CLASS_DESCENDING);
        } else {
            this.service.addSorting(columnName, ASCENDING);
            th.addClass(SORTABLE_CLASS_ASCENDING);
        }
    }
}
