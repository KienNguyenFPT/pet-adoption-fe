import { Image } from "./common";

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
  petImages: Image[] | null | undefined;
}
