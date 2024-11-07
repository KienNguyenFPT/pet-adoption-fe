import { Pet, Response } from "../types/pet";
import { Health } from "../types/health";
import { getAllPets } from "./petService";

export const getAllHealth = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health/GetAllHealths`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      // mode: "no-cors",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const healths = await response.json();
  if (healths.success) {
    const petsResonse = await getAllPets();
    if (petsResonse && petsResonse.success) {
      healths.data = healths.data.map((health: Health) => {
        const petInfo = petsResonse.data.find(
          (pet: Pet) => pet.id == health.petId
        );
        return { ...health, petName: petInfo?.petName };
      });
    }
  }

  return healths;
};

export const addHealth = async (
  health: Omit<Health, "petName">
): Promise<Health> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health/CreateHealth`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        mode: "no-cors",
      },
      body: JSON.stringify({
        id: health.id,
        date: health.date,
        shortDescription: health.shortDescription,
        vaccineStatus: health.vaccineStatus,
        petId: health.petId,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add health");
  }
  return response.json();
};

export const getHealthById = async (
  id: string
): Promise<Omit<Health, "petName">> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health/GetHealthById/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get health");
  }
  return response.json();
};

export const updateHealth = async (
  health: Omit<Health, "petName">
): Promise<Health> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health/UpdateHealth/${health.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          id: health.id,
          date: health.date,
          shortDescription: health.shortDescription,
          vaccineStatus: health.vaccineStatus,
          petId: health.petId,
        }),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update health:", errorText);
      throw new Error("Failed to update health");
    }
    return response.json();
  } catch (error) {
    console.error("Error in updateHealth:", error);
    throw error;
  }
};
export const deleteHealth = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health/DeleteHealth/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to delete health");
  }
};
