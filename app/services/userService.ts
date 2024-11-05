import { Response } from "../types/pet";
import { User } from "../types/user";

export const getAllUsers = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/User/GetAllUsers/userList`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const addUser = async (user: Omit<User, "id">): Promise<User> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/User/AddUser`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        userName: user.userName,
        age: user.age,
        breed: user.breed,
        gender: user.gender,
        description: user.description,
        rescuedDate: user.rescuedDate,
        shelterId: user.shelterId,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add user");
  }
  return response.json();
};

export const getUserById = async (id: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/User/GetUser/${id}`,
    {
      method: "GET",
      headers: {},
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
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/User/UpdateUser/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          userName: user.userName,
          age: user.age,
          breed: user.breed,
          gender: user.gender,
          description: user.description,
          rescuedDate: user.rescuedDate,
          shelterId: user.shelterId,
        }),
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
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/User/DeleteUser/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return response.json();
};
