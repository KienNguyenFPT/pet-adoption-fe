/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Event {
  eventType: number;
  images: any | null;
  id: string;
  startDate: string;
  endDate: string;
  eventName: string;
  description: string;
  eventStatus: number;
  location: string;
}