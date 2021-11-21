export interface MasterDataModel {
  count: number;
  next: null;
  previous: null;
  results?: ResultDataModel[];
}

export interface ResultDataModel {
  id: number;
  name: string;
}

export interface MenuModel {
  link?: string;
  name: string;
  icon: string;
  children?: ChildMenuModel[];
}

export interface ChildMenuModel {
  link: string;
  name: string;
  icon: string;
}

export type FIELD_TYPE = 'text' | 'select';

export interface MasterDataGridModel {
  gridTitle: string;
  apiEnd: string;
  fieldLabels: string[];
  fields: string[];
  extraField?: FormFieldModel;
}

export interface FormFieldModel {
  endPoint: string;
  type: FIELD_TYPE;
}
export interface MasterDataResponseModel {
  count: number;
  next: null;
  previous: null;
  results: MasterDataResponseBodyModel[];
}

export interface MasterDataResponseBodyModel {
  id: number;
  name: string;
  state?: number;
  state_details?: DataDetailsModel;
  district?: number;
  district_details?: DataDetailsModel;
}

export interface DataDetailsModel {
  name: string;
}

export interface ValidateModel {
  message: string;
  is_exist: boolean;
}

export interface UpdateDataModel {
  active: boolean;
  selected: number;
}
