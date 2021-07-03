// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  master_data: 'http://localhost:4040/assets/data/agreement.json'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
