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
