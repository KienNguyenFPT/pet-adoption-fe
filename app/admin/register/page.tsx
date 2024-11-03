"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { handleRegister } from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const onLogin = async () => {
    try {
      const isAdmin = role === "Admin" ? true : false;
      const isStaff = role === "Staff" ? true : false;
      const data = await handleRegister(
        isAdmin,
        isStaff,
        email,
        password,
        fullname,
        phoneNumber
      );
      router.push("/admin/login");
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
          Register An Account
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
            id="fullname"
            label="Fullname"
            name="fullname"
            autoComplete="fullname"
            autoFocus
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="phoneNumber"
            autoFocus
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              required
              labelId="role-select-label"
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={onLogin}
          >
            Register
          </Button>
          <p>
            You already have an account?&nbsp;
            <a href="/admin/login" style={{ color: "#1976d2" }}>
              Login here
            </a>
          </p>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
