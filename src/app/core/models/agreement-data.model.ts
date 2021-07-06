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
