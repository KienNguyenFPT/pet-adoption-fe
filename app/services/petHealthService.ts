import { Response } from "../types/pet";
import { Health } from "../types/health";

export const getAllHealth = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

export const addHealth = async (
  health: Omit<Health, "id">
): Promise<Health> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        healthName: health.healthName,
        age: health.age,
        breed: health.breed,
        gender: health.gender,
        description: health.description,
        rescuedDate: health.rescuedDate,
        shelterId: health.shelterId,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add health");
  }
  return response.json();
};

export const getHealthById = async (id: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health/${id}`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get health");
  }
  return response.json();
};

export const updateHealth = async (health: Health): Promise<Health> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health/${health.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          healthName: health.healthName,
          age: health.age,
          breed: health.breed,
          gender: health.gender,
          description: health.description,
          rescuedDate: health.rescuedDate,
          shelterId: health.shelterId,
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
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Health/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to deletehealth");
  }
  return response.json();
};
