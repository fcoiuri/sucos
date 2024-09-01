export interface User {
  id: number;
  username: string;
  name: string;
  address: string;
  opt_payment: number;
  iat?: number;
  exp?: number;
}
