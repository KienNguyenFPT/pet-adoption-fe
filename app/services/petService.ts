import { Pet, PetResponse } from "../types/pet";

const API_URL = "/api/pets";

export const getAllPets = async (): Promise<PetResponse> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch pets");
  }
  return response.json();
};

export const addPet = async (pet: Omit<Pet, "id">): Promise<Pet> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });
  if (!response.ok) {
    throw new Error("Failed to add pet");
  }
  return response.json();
};

export const updatePet = async (pet: Pet): Promise<Pet> => {
  const response = await fetch(`${API_URL}/${pet.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });
  if (!response.ok) {
    throw new Error("Failed to update pet");
  }
  return response.json();
};

export const deletePet = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete pet");
  }
};
