import { Adoption } from "./adoption";
import { Donation } from "./donation";
import { Event } from "./event";
import { Health } from "./health";
import { Pet } from "./pet";
import { Shelter } from "./shelter";
import { User } from "./user";

export interface Image {
  id: string | null | undefined;
  image: string | undefined;
  imageUrl: string | undefined;
}

export interface Response {
  data:
    | Adoption
    | Donation
    | Event
    | Health
    | Pet
    | Shelter
    | User
    | Image
    | Image[]
    | Adoption[]
    | Donation[]
    | Event[]
    | Health[]
    | Pet[]
    | Shelter[]
    | User[]
    | undefined
    | null
    | "";
  success: boolean;
  message: string;
  error: boolean;
  errorMessages: string;
}
