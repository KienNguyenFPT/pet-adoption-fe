import { Pet, Response } from "../types/pet";

export const getAllPets = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/Pet/GetAllPets`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch pets");
  }
  return response.json();
};

export const addPet = async (pet: Omit<Pet, "id">): Promise<Pet> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/Pet/AddPet`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        petName: pet.petName,
        age: pet.age,
        breed: pet.breed,
        gender: pet.gender,
        description: pet.description,
        rescuedDate: pet.rescuedDate,
        shelterId: pet.shelterId,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add pet");
  }
  return response.json();
};
//TODO
export const updatePet = async (pet: Pet): Promise<Pet> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/Pet/AddPet`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pet),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update pet");
  }
  return response.json();
};
//TODO
export const deletePet = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/Pet/AddPet`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete pet");
  }
  return response.json();
};
