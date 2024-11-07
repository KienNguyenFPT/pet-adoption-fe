import { Response } from "../types/pet";
import { User } from "../types/user";

export const getAllUsers = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/User/GetAllUsers/userList`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const getUserById = async (id: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/User/GetUserById/user/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get user");
  }
  return response.json();
};

export const updateUser = async (user: User): Promise<User> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/User/UpdateUserById/updateUser/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(user),
      }
    );
    console.log(response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update user:", errorText);
      throw new Error("Failed to update user");
    }
    return response.json();
  } catch (error) {
    console.error("Error in update user:", error);
    throw error;
  }
};
export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/User/DeleteUserById/deleteUser/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};
