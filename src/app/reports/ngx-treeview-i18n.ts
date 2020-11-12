import {Injectable} from '@angular/core';
// import {I18n} from './i18n';
import {TreeviewI18n, TreeviewItem, TreeviewSelection} from 'ngx-treeview';

@Injectable()
export class EntityTreeviewI18n extends TreeviewI18n {
    constructor(/*protected i18n: I18n*/) {
        super();
    }

    getText(selection: TreeviewSelection): string {
        if (selection.uncheckedItems.length === 0) {
            return this.getAllCheckboxText();
        }
        switch (selection.checkedItems.length) {
            case 0:
                return 'Select entities';
            case 1:
                return selection.checkedItems[0].text;
            default:
                return selection.checkedItems.length + " entities selected";
        }
    }
    getAllCheckboxText(): string {
        return  "All entities";
    }
    getFilterPlaceholder(): string {
        return "Filter entities by name";
    }
    getFilterNoItemsFoundText(): string {
        return "No entities found";
    }
    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return "collapse/expand";
    }
}
