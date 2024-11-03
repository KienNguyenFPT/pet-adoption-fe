import { Adoption } from "../types/adoption";
import { Response } from "../types/pet";

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
  return response.json();
};

export const addAdoption = async (
  adoption: Omit<Adoption, "id">
): Promise<Adoption> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/AddAdoption`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        adoptionName: adoption.adoptionName,
        age: adoption.age,
        breed: adoption.breed,
        gender: adoption.gender,
        description: adoption.description,
        rescuedDate: adoption.rescuedDate,
        shelterId: adoption.shelterId,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add adoption");
  }
  return response.json();
};

export const addImage = async (
  adoptionId: string,
  file: File
): Promise<Response> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/AdoptionImages/AddAdoptionPhotos/AddPhoto/${adoptionId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add adoption image");
  }
  return response.json();
};
export const getAdoptionById = async (id: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/GetAdoption/${id}`,
    {
      method: "GET",
      headers: {},
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
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/UpdateAdoption/${adoption.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          adoptionName: adoption.adoptionName,
          age: adoption.age,
          breed: adoption.breed,
          gender: adoption.gender,
          description: adoption.description,
          rescuedDate: adoption.rescuedDate,
          shelterId: adoption.shelterId,
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
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Adoption/DeleteAdoption/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete adoption");
  }
  return response.json();
};
