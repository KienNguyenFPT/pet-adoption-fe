export interface Donation {
  id: string | undefined | null;
  money: number;
  date: string;
  shelterId: string;
  shelterAddress: string | null;
  transactionId: string;
  paymentStatus: string | null;
}
