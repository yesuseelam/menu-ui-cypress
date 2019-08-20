export interface ChildItem {
    parent_tag: string;
    name: string;
    tag: string;
    parent_name: string
    selected?: boolean
    accord?:boolean
    childItems?: ChildItem[]
    lastupdatedby?: string
    lastupdatedate: string
}
