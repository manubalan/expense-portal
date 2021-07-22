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
  end_date?: string | null;
  narration?: string;
  location: number;
  district: number;
  state: number;
}

export interface AgreementListResponseModel extends GetResponseMode {
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

export interface VehicleExpenseResponseModel extends GetResponseMode {
  results: VehicleExpenseListResultModel[];
}

export interface VehicleExpenseListResultModel {
  id: number;
  agreement_details: AgreementDetailsModel;
  vehicle_type_details: DetailsModel;
  driver_name_details: DetailsModel;
  materials_from_details: DetailsModel;
  materials_details: DetailsModel;
  created_on: string;
  updated_on: string;
  vehicle_details: string;
  qty_type: string;
  quantity: number;
  delivery_date: string;
  amount: number;
  amount_paid: number;
  amount_date: string;
  betha: number;
  betha_paid: number;
  vechicle_charge: number;
  narration: string;
  total_amount: number;
  agreement: number;
  vehicle_type: number;
  driver_name: number;
  materials_from: number;
  materials: number;
}

export interface AgreementDetailsModel {
  agreement_number: string;
}

export interface EmployeeExpenseResponseModel extends GetResponseMode {
  results: EmployeeExpenseListResultModel[];
}

export interface EmployeeExpenseListResultModel {
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
  paid_date: string;
  narration: string;
  agreement: number;
  name: number;
  Work_type: number;
}
