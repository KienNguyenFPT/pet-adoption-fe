import { Image } from "./common";

export interface Event {
  eventType: number | null;
  images: Image[] | null;
  id: string;
  startDate: string;
  endDate: string;
  eventName: string;
  description: string;
  eventStatus: number;
  location: string;
}
