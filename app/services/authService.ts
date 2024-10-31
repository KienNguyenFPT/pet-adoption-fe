/* eslint-disable @typescript-eslint/no-unused-vars */
import { access } from "fs";

export async function handleLogin(emailAddress: string, passwordHash: string) {
  try {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/Authentication/LoginWithEmailAndPasswordJWT`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ emailAddress, passwordHash }),
    // });

    // if (!response.ok) {
    //   throw new Error('Login failed');
    // }
    // const data = await response.json();
    const data = {
      username: "admin1",
      role: "admin",
      accessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    };
    return data;
  } catch (error: any) {
    throw new Error("Invalid credentials");
  }
}
