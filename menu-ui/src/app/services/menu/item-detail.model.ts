import {ItemAttribute} from "./item-attribute.model";
import {ItemSummary} from "./item-summary.model";

export interface ItemDetail {
    name: string;
    disabled: boolean;
    disabledSource: string;
    tag: string;
    childCount: number;
    path: string;
    jsonPath: string;
    loadingChildren: boolean;
    retailModifiedItemId: string;
    itemPrice: number;
    subsGroupId: string;
    typeName: string;
    attributes: ItemAttribute[];
    unassigned: ItemAttribute[];
    items: ItemSummary[];
}