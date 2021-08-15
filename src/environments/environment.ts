export const environment = {
  production: false,

  BASE_URL: 'http://localhost:4040',

  AUTH_ENDPOINT: 'http://18.118.104.163',
  AUTH_PORT: '8000',
  AUTH_PREFIX: 'api',

  MASTER_ENDPOINT: 'http://18.118.104.163',
  MASTER_PORT: '8000',
  MASTER_PREFIX: 'api',

  BASE_ENDPOINT: 'http://18.118.104.163',
  BASE_PORT: '8000',
  BASE_PREFIX: 'api',
};

export const endPoints = {
  authentication_EndPoint: `${environment.AUTH_ENDPOINT}:${environment.AUTH_PORT}/${environment.AUTH_PREFIX}/`,
  master_data_EndPoint: `${environment.MASTER_ENDPOINT}:${environment.MASTER_PORT}/${environment.MASTER_PREFIX}/`,
  base_api_EndPoint: `${environment.BASE_ENDPOINT}:${environment.BASE_PORT}/${environment.BASE_PREFIX}/`,
};
