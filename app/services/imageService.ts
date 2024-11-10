import { Response } from "../types/common";

export const getAllImages = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/GetAllPhotos`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Images");
  }
  return response.json();
};

export const deleteImage = async (photoId: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/PetImages/DeletePetPhoto/Delete/${photoId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete Image");
  }
  return response.json();
};
