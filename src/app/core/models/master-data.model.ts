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
