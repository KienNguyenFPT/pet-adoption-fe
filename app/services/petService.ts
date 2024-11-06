import { Pet, Response } from "../types/pet";

export const getAllPets = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY1}/api/Pet/GetAllPets`,
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
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Pet/AddPet`,
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

export const addImage = async (
  petId: string,
  file: File
): Promise<Response> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/PetImages/AddPetPhotos/AddPhoto/${petId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add pet image");
  }
  return response.json();
};
export const getPetById = async (id: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Pet/GetPet/${id}`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get pet");
  }
  return response.json();
};

export const updatePet = async (pet: Pet): Promise<Pet> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Pet/UpdatePet/${pet.id}`,
      {
        method: "PUT",
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
    console.log(response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update pet:", errorText);
      throw new Error("Failed to update pet");
    }
    return response.json();
  } catch (error) {
    console.error("Error in updatePet:", error);
    throw error;
  }
};
export const deletePet = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Pet/DeletePet/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete pet");
  }
  return response.json();
};
