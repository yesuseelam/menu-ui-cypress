import {Options} from "./options.model";

export interface ItemAttribute {
    jsonProperty: string;
    name: string;
    tag: string;
    countryCode: string;
    value: any;
    isOverride: boolean;
    required: boolean;
    scope: string;
    options: Options[];
    type: string;
}
