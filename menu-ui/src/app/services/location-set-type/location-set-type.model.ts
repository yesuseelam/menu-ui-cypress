export interface LocationSetType {
  tag: string;
  name: string;
  weight?: Number;
  selected?: boolean;
  locked?: boolean;
  deleted?: boolean;
  description?: string;
  lastupdatedby?: string;
  lastupdatedate: string;
  childScope: string;
  parentScope: string;
}
