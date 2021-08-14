import { endPoints } from 'src/environments/environment'

const searchKey = '?search=';

export const API_END_POINT = {
  authentication: `${endPoints.authentication_EndPoint}login/`,
  auth_refresh: `${endPoints.authentication_EndPoint}token-refresh/`,
  masterData: {
    states: `${endPoints.master_data_EndPoint}states/`,
    district: `${endPoints.master_data_EndPoint}districts/`,
    district_params: `${endPoints.master_data_EndPoint}districts/?state=`,
    location: `${endPoints.master_data_EndPoint}locations/`,
    location_params: `${endPoints.master_data_EndPoint}locations/`,
    vehicle_type: `${endPoints.master_data_EndPoint}vehicle-types/`,
    materials: `${endPoints.master_data_EndPoint}materials/`,
    employees: `${endPoints.master_data_EndPoint}employees/`,
    worktypes: `${endPoints.master_data_EndPoint}worktypes/`,
  },
  agreement: {
    data_operations: `${endPoints.base_api_EndPoint}agreements/`,
    validate_item: `${endPoints.base_api_EndPoint}agreements/validate_agreement_number/?agreement_number=`,
    vehicle_expense: `${endPoints.base_api_EndPoint}vehicle-expenses/`,
    employee_expense: `${endPoints.base_api_EndPoint}employees-expenses/`,
  },
  reports: {
    employee_expense: `${endPoints.base_api_EndPoint}employees-expenses`,
    employee_wise_expense: `${endPoints.base_api_EndPoint}employees-wise-expenses`,
    vehicle_expense: `${endPoints.base_api_EndPoint}vehicle-expenses`,
    driver_expense: `${endPoints.base_api_EndPoint}driver-wise-expense`,
  }
};
