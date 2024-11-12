import { Adoption } from "../types/adoption";
import { Pet } from "../types/pet";
import { getAllPets } from "./petService";
import { Response } from "../types/common";

export const getAllAdoptions = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/GetAllAdoptionForms/AdoptionForm`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch adoptions");
  }
  const adoption = await response.json();
  if (adoption.success) {
    const petsResonse = await getAllPets();
    if (petsResonse && petsResonse.success) {
      adoption.data = adoption.data.map((ad: Adoption) => {
        const petInfo: Pet = (petsResonse.data as Pet[]).find(
          (pet) => pet.id == ad.petId
        ) as Pet;
        return {
          ...ad,
          petName: petInfo?.petName,
          petImages: petInfo.petImages,
        };
      });
    }
  }
  return adoption;
};

export const addAdoption = async (
  adoption: Omit<Adoption, "id">
): Promise<Adoption> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/AddAdoptionForm/AddAdoptionForm/${adoption.petId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        adoptionReason: adoption.adoptionReason,
        petExperience: adoption.petExperience,
        address: adoption.address,
        contactNumber: adoption.contactNumber,
        notes: adoption.notes,
        userEmail: adoption.userEmail,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add adoption");
  }
  return response.json();
};

export const getAdoptionByPetId = async (petId: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/GetAdoptionByPetId/AdoptionPet/${petId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get adoption by pet");
  }
  return response.json();
};

export const getAdoptionById = async (id: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/GetAdoption/AdoptionForm/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get adoption");
  }
  return response.json();
};

export const updateAdoption = async (adoption: Adoption): Promise<Adoption> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/UpdateAdoption/UpdateAdoptionForm/${adoption.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          applicationDate: adoption.applicationDate,
          approvalDate: adoption.approvalDate,
          adoptionStatus: adoption.adoptionStatus,
          adoptionReason: adoption.adoptionReason,
          petExperience: adoption.petExperience,
          address: adoption.address,
          contactNumber: adoption.contactNumber,
          notes: adoption.notes,
          userEmail: adoption.userEmail,
          petId: adoption.petId,
        }),
      }
    );
    console.log(response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update adoption:", errorText);
      throw new Error("Failed to update adoption");
    }
    return response.json();
  } catch (error) {
    console.error("Error in updateAdoption:", error);
    throw error;
  }
};
export const deleteAdoption = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/UpdateAdoption/DeleteAdoptionForm/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete adoption");
  }
};

export const getAdoptionByUserId = async (
  userId: string
): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/GetAdoptionPetbyUserId/getAdoptionsByUserId/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get adoption by user");
  }
  return response.json();
};
