/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  userName: string;
  age: string;
  breed: string;
  gender: string;
  description: string;
  rescuedDate: string | null;
  shelterId: string;
  shelterName: string;
  userImages: any | null;
}
