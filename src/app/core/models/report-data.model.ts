export interface GetResponseModel {
  count: number;
  next: null;
  previous: null;
  results: ResultModel[];
}

export interface ResultModel {
  id: number;
  agreement_details: AgreementDetailsModel;
  employee_name_details: DetailsModel;
  work_type_details: DetailsModel;
  created_on: string;
  updated_on: string;
  day: string;
  work_date: string;
  kooli: number;
  kooli_paid: number;
  paid_date: null | string;
  narration: string;
  agreement: number;
  name: number;
  Work_type: number;
}

export interface AgreementDetailsModel {
  location_details: DetailsModel;
  agreement_number: string;
}

export interface DetailsModel {
  name: string;
}
