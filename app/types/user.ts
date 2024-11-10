export interface User {
  id: string;
  emailAddress: string;
  fullName: string;
  phoneNumber: string;
  role: number;
}
export interface TokenDecoded {
  Email: string;
  Role: string;
  Id: string;
}
