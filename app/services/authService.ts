/* eslint-disable @typescript-eslint/no-unused-vars */
import { access } from "fs";
import jwt from "jsonwebtoken";

export async function handleLogin(emailAddress: string, passwordHash: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Authentication/LoginWithEmailAndPasswordJWT`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress, passwordHash }),
      }
    );
    // if (!response.ok) {
    //   throw new Error("Login failed");
    // }
    const data = await response.json();
    if (data.success) {
      const decodedToken = jwt.decode(data.token);
      if (!decodedToken) throw new Error("Invalid credentials.");

      const d = {
        username: decodedToken.Email,
        role: decodedToken.Role,
        accessToken: data.token,
      };
      return d;
    } else {
      return data;
    }
  } catch (error) {
    throw new Error("Invalid credentials");
  }
}

export async function handleRegister(
  isAdmin: boolean = false,
  isStaff: boolean = false,
  emailAddress: string,
  passwordHash: string,
  fullName: string,
  phoneNumber: string
) {
  try {
    const path = isAdmin
      ? "/api/Authentication/RegisterAdminAccount"
      : isStaff
      ? "/api/Authentication/RegisterStaffAccount"
      : "/api/Authentication/RegisterAnAccount";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress,
          passwordHash,
          fullName,
          phoneNumber,
        }),
      }
    );
    console.log(response);

    // if (!response.ok) {
    //   throw new Error("Register failed.");
    // }
    const data = await response.text();
    console.log({ data });

    if (data == "Registered Successfully") return data;
    throw new Error("Register failed! Please try again.");
  } catch (error: any) {
    console.log(error.message);

    throw new Error("Register failed. Please try again.");
  }
}
