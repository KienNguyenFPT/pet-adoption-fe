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
  petImages: any | null;
}
export interface Response {
  data: any;
  success: boolean;
  message: string;
  error: boolean;
  errorMessages: string;
}
