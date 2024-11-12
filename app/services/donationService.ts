import { Donation } from "../types/donation";
import { Response } from "../types/common";
import { Shelter } from "../types/shelter";
import { getAllShelters } from "./shelterService";

export const getAllDonations = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Donation/GetDonations/GetAllDonation`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch donations");
  }
  const donation = await response.json();
  if (donation && donation.success) {
    const sheltersResonse = await getAllShelters();
    if (sheltersResonse && sheltersResonse.success) {
      donation.data = donation.data.map((ad: Donation) => {
        const shelterInfo: Shelter = (sheltersResonse.data as Shelter[]).find(
          (sh) => sh.id == ad.shelterId
        ) as Shelter;
        console.log(shelterInfo);

        return {
          ...ad,
          shelterAddress: shelterInfo?.address,
        };
      });
    }
  }
  return donation;
};

export const createDonation = async (
  donation: Omit<Donation, "id">
): Promise<Donation> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Donation/CreatePayment/CreatePayment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        money: donation.money,
        date: donation.date,
        shelterId: donation.shelterId,
        // transactionId: uuidv4(),
        // paymentStatus: donation.paymentStatus,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create donation");
  }
  return response.json();
};

export const getDonationByUserId = async (
  userId: string
): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Donation/GetDonationByUser/GetDonationByUserId/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get donation by user");
  }
  const donation = await response.json();
  if (donation && donation.success) {
    const sheltersResonse = await getAllShelters();
    if (sheltersResonse && sheltersResonse.success) {
      donation.data = donation.data.map((ad: Donation) => {
        const shelterInfo: Shelter = (sheltersResonse.data as Shelter[]).find(
          (sh) => sh.id == ad.shelterId
        ) as Shelter;
        console.log(shelterInfo);

        return {
          ...ad,
          shelterAddress: shelterInfo?.address,
        };
      });
    }
  }
  return donation;
};
