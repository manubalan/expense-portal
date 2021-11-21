export const APP_BASE_URL = 'https://pullattugroup.com';
export const BASE_PORT = '8000';

export const environment = {
  production: true,

  BASE_URL: APP_BASE_URL + '/',

  AUTH_ENDPOINT: APP_BASE_URL,
  AUTH_PORT: BASE_PORT,
  AUTH_PREFIX: 'api',

  MASTER_ENDPOINT: APP_BASE_URL,
  MASTER_PORT: BASE_PORT,
  MASTER_PREFIX: 'api',

  BASE_ENDPOINT: APP_BASE_URL,
  BASE_PORT: BASE_PORT,
  BASE_PREFIX: 'api',
};

export const endPoints = {
  authentication_EndPoint: `${environment.AUTH_ENDPOINT}:${environment.AUTH_PORT}/${environment.AUTH_PREFIX}/`,
  master_data_EndPoint: `${environment.MASTER_ENDPOINT}:${environment.MASTER_PORT}/${environment.MASTER_PREFIX}/`,
  base_api_EndPoint: `${environment.BASE_ENDPOINT}:${environment.BASE_PORT}/${environment.BASE_PREFIX}/`,
};
