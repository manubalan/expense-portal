import { endPoints } from 'src/environments/environment'


export const API_END_POINT = {
  authentication: `${endPoints.authentication_EndPoint}login/`,
  auth_refresh: `${endPoints.authentication_EndPoint}token-refresh/`,
  masterData: {
    states: `${endPoints.master_data_EndPoint}states/`,
    district: `${endPoints.master_data_EndPoint}districts/`,
    location: `${endPoints.master_data_EndPoint}locations/`,
    vehicle_type: `${endPoints.master_data_EndPoint}vehicle-types/`,
    materials: `${endPoints.master_data_EndPoint}materials/`,
    employees: `${endPoints.master_data_EndPoint}employees/`,
    worktypes: `${endPoints.master_data_EndPoint}worktypes/`,
  },
};


// http://18.118.104.163:8000/
// http://18.118.104.163:8000/api/districts/?state=1
// http://18.118.104.163:8000/api/locations/?district=1
// http://18.118.104.163:8000/api/vehicle-types/
// http://18.118.104.163:8000/api/materials/?search=a
// http://18.118.104.163:8000/api/employees/
// http://18.118.104.163:8000/api/worktypes/