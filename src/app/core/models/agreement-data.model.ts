export interface AgreementRequestModel {
  agreement_number: string;
  name?: string;
  amount: number;
  start_date: string;
  end_date: string;
  narration?: string;
  location: number;
  district: number;
  state: number;
}

export interface AgreementListModel {
  count?: number;
  next?: string;
  previous?: null;
  results?: AgreementListResultModel[];
}

export interface AgreementListResultModel {
  id: number;
  location_details: DetailsModel;
  district_details: DetailsModel;
  state_details: DetailsModel;
  expense: number;
  created_on: string;
  updated_on: string;
  agreement_number: string;
  name: string;
  amount: number;
  start_date: string;
  end_date: string;
  narration: string;
  location: number;
  district: number;
  state: number;
}

export interface DetailsModel {
  name: string;
}
