const BASE_URL = "http://localhost:3000";

export const environment = {
  production: false,
  // BASE_URL: "http://localhost:3000",

  // get USER_URL() {
  //   return `${this.BASE_URL}/users`;
  // },

  // get PRODUCTS_URL() {
  //   return `${this.BASE_URL}/products`;
  // },

  // get AUTH_URL() {
  //   return `${this.BASE_URL}/credentials`
  // }

  USER_URL: `${BASE_URL}/users`,
  PRODUCTS_URL: `${BASE_URL}/products`,
  AUTH_URL: `${BASE_URL}/credentials`,
};