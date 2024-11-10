/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import moment from "moment";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Layout from "@/app/components/Layout";
import { updateUser, getUserById } from "@/app/services/userService";
import { User } from "@/app/types/user";
import { useSearchParams } from "next/navigation";
import { Alert } from "@mui/material";

const EditUser = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: "",
    emailAddress: "",
    fullName: "",
    phoneNumber: "",
    role: 0,
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || localStorage.getItem("role") != "Administrator") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (id) {
      getUserById(id).then((response) => {
        console.log(response.data);
        setUser(response.data);
        setNewUser(response.data);
      });
    }
  }, [id]);

  const handleUpdateUser = async () => {
    if (user) {
      try {
        await updateUser({ ...user, ...newUser });
        router.push("/admin/user-management");
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
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        You do not have permissions to view this page.
      </div>
    );
  }
  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
        Edit User <b> {newUser.fullName}</b>
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
            <FormControl fullWidth>
              <InputLabel id="gender-id-label">Role</InputLabel>
              <Select
                labelId="gender-id-label"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: +e.target.value })
                }
              >
                <MenuItem key="0" value="0" selected>
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

export default EditUser;
