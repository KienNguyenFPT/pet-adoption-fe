import { access } from "fs";

export async function handleLogin(username: string, password: string) {
    try {
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username, password }),
      // });
  
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
  
      // const data = await response.json();
      const data = {username: 'admin1', role:'admin', accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'}
      return data;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }