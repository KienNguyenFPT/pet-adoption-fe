/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { getUserById, updateUser } from "../../services/userService";
import { User } from "../../types/user";
import { Alert } from "@mui/material";

const UserManagement = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log({ storedRole });

    if (storedRole) {
      setRole(role);
    }
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [user, setUser] = useState<User>({
    id: localStorage.getItem("userId") || "",
    emailAddress: "",
    fullName: "",
    phoneNumber: "",
    role: 0,
  });
  const [newUser, setNewUser] = useState<User>({
    id: "",
    emailAddress: "",
    fullName: "",
    phoneNumber: "",
    role: 0,
  });
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(localStorage.getItem("userId") || "");
        console.log(res);

        if (res && res.success) {
          setUser(res.data);
          setNewUser(res.data);
          console.log(user, newUser);
        } else {
          setNotification({ message: "Failed to get user", type: "error" });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setNotification({ message: "Failed to fetch user.", type: "error" });
      }
    };
    fetchUser();
  }, []);

  const handleUpdateUser = async () => {
    if (user) {
      try {
        await updateUser({ ...user, ...newUser });
        setNotification({
          message: "User updated successfully",
          type: "success",
        });
      } catch (error) {
        setNotification({
          message: "Failed to updating user.",
          type: "error",
        });
        console.error("Error updating user:", error);
      }
    }
  };
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
        Update Profile Information
      </Typography>
      <div style={{ marginBottom: "15px" }}>
        {notification && (
          <Alert
            severity={notification.type}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        )}
      </div>
      <Box component="form" sx={{ mb: 2, ml: 2, mr: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Email Address"
              value={newUser.emailAddress}
              onChange={(e) =>
                setNewUser({ ...newUser, emailAddress: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Full Name"
              value={newUser.fullName}
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Phone Number"
              value={newUser.phoneNumber}
              onChange={(e) =>
                setNewUser({ ...newUser, phoneNumber: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth disabled={true}>
              <InputLabel id="gender-id-label">Role</InputLabel>
              <Select
                labelId="gender-id-label"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: +e.target.value })
                }
              >
                <MenuItem key="0" value="0">
                  Admin
                </MenuItem>
                <MenuItem key="2" value="2">
                  Staff
                </MenuItem>
                <MenuItem key="1" value="1">
                  User
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleUpdateUser} sx={{ mt: 2 }}>
          Update
        </Button>
      </Box>
    </Layout>
  );
};

export default UserManagement;
