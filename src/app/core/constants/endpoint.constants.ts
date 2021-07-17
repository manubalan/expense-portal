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
    location_params: `${endPoints.master_data_EndPoint}locations/?district=`,
    vehicle_type: `${endPoints.master_data_EndPoint}vehicle-types/`,
    vehicle_type_params: `${endPoints.master_data_EndPoint}vehicle-types/${searchKey}`,
    materials: `${endPoints.master_data_EndPoint}materials/`,
    materials_params: `${endPoints.master_data_EndPoint}materials/${searchKey}`,
    employees: `${endPoints.master_data_EndPoint}employees/`,
    employees_params: `${endPoints.master_data_EndPoint}employees/${searchKey}`,
    worktypes: `${endPoints.master_data_EndPoint}worktypes/`,
    worktypes_params: `${endPoints.master_data_EndPoint}worktypes/${searchKey}`,
  },
  agreement: {
    data_operations: `${endPoints.base_api_EndPoint}agreements/`,
    validate_item: `${endPoints.base_api_EndPoint}agreements/validate_agreement_number/?agreement_number=`,
    vehicle_expense: `${endPoints.base_api_EndPoint}vehicle-expenses/`,
    employee_expense: `${endPoints.base_api_EndPoint}employees-expenses/`,
  }
};
