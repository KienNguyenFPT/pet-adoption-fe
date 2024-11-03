/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Adoption {
  id: string;
  adoptionName: string;
  age: string;
  breed: string;
  gender: string;
  description: string;
  rescuedDate: string | null;
  shelterId: string;
  shelterName: string;
  adoptionImages: any | null;
}
