import { Response } from "../types/pet";

export const getAllShelters = async (): Promise<Response> => {
  console.log(process.env.NEXT_PUBLIC_API_GATEWAY);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/Shelter/GetAllShelters`,
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
