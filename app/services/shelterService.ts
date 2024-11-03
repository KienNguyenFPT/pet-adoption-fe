import { Response } from "../types/pet";
import { Shelter } from "../types/shelter";

export const getAllShelters = async (): Promise<Response> => {
  console.log(process.env.NEXT_PUBLIC_API_GATEWAY);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Shelter/GetAllShelters`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch shelters");
  }
  return response.json();
};

export const addShelter = async (
  shelter: Omit<Shelter, "id">
): Promise<Shelter> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Shelter/CreateShelter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(shelter),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add shelter");
  }
  return response.json();
};

export const updateShelter = async (shelter: Shelter): Promise<Shelter> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Shelter/UpdateShelter`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...shelter,
        }),
      }
    );
    console.log(response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update shelter:", errorText);
      throw new Error("Failed to update shelter");
    }
    return response.json();
  } catch (error) {
    console.error("Error in update shelter:", error);
    throw error;
  }
};
export const deleteShelter = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Shelter/DeleteShelter/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete shelter");
  }
  return response.json();
};
