export class Attribute {
    tag: string;
    name: string;
    jsonProperty?: string;
    scope: string;
    selected?: boolean;
    description?: string;
    required: boolean;
    locked: boolean;
    type?: string;
    typetag?: string; // TODO Remove when all refs removed
    hasOptions: boolean;
    defaultValue?: any;
    svOptions?: any;  // TODO Remove when all refs removed
    options?: any;
    updatedBy?: string;
    dateUpdated: string;
}
