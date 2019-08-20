import { Attribute } from '../attribute/attribute.model';

export interface Item {
    tag: string;
    name: string;
    sName?: string;
    sDescription: string;
    selected?: boolean;
    accord?: boolean;
    description?: string;
    itemTypeName?: string;
    itemType?: string;
    itemClass: string;
    itemTypePrice?: any;
    globalAttributes?: innerAttribute[];
    localAttributes?: any;
    attributes?: any;
    menuItem?: any;
    lastUpdatedBy?: string;
    lastUpdatedDate: string;
}

interface innerAttribute {
    attribute: Attribute;
    attributeSVS?: any;
    ctag?: string;
    itemAttrTag: string;
    itemAttrVal: string;
    itemTag: string;
    lastUpdatedBy: string;
}
