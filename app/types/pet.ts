/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Pet {
  id: string;
  petName: string;
  age: string;
  breed: string;
  gender: string;
  description: string;
  rescuedDate: string;
  shelterId: string;
  shelterName: string;
  petImages: any;
}
export interface PetResponse {
  data: Pet[];
  success: boolean;
  message: string;
  error: boolean;
  errorMessages: string;
}
