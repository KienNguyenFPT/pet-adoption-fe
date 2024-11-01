/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Pet {
  id: string;
  petName: string;
  age: string;
  breed: string;
  gender: string;
  description: string;
  rescuedDate: string | null;
  shelterId: string;
  shelterName: string;
  petImages: any;
}
export interface Response {
  data: any;
  success: boolean;
  message: string;
  error: boolean;
  errorMessages: string;
}
