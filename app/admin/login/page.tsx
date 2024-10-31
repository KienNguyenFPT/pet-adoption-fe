"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { handleLogin } from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onLogin = async () => {
    try {
      // const passwordHash = await bcrypt.hash(password, 10);
      const passwordHash = "12345";
      const data = await handleLogin(email, passwordHash);

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("username", data.username);
        document.cookie = `accessToken=${data.accessToken}; path=/;`;
      }

      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "staff") {
        alert("Logged in as Staff");
        router.push("/admin");
      } else {
        alert("Unknown role");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: "url(/images/background-login.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email address"
            name="email"
            autoComplete="emailAddress"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={onLogin}
          >
            Sign In
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
