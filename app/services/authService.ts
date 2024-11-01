/* eslint-disable @typescript-eslint/no-unused-vars */
import { access } from "fs";
import jwt from "jsonwebtoken";

export async function handleLogin(emailAddress: string, passwordHash: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/Authentication/LoginWithEmailAndPasswordJWT`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress, passwordHash }),
      }
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }
    const data = await response.json();
    if (data.success) {
      const decodedToken = jwt.decode(data.token);
      const d = {
        username: decodedToken.Email,
        role: decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
        accessToken: data.token,
      };
      return d;
    }
    throw new Error("Invalid credentials.");
  } catch (error: any) {
    throw new Error("Invalid credentials");
  }
}
