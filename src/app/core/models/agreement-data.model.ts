export interface GetResponseMode {
  count?: number;
  next?: string;
  previous?: null;
}

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

export interface AgreementListModel extends GetResponseMode {
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

export interface ValidateAgreementResponseModel {
  message?: string;
  is_exist?: boolean;
  showNow: boolean;
}

export interface ConstantDataModel {
  id: number;
  label: string;
  value: string;
}

export interface VehicleTypeListModel extends GetResponseMode {
  results: VehicleTypeResultModel[];
}

export interface VehicleTypeResultModel {
  id: number;
  name: string;
}
export interface EmployeeExpenseRequestModel {
  day: string;
  work_date: string;
  kooli: number;
  kooli_paid: number;
  paid_date: string;
  narration: string;
  agreement: string;
  name: string;
  Work_type: string;
}
