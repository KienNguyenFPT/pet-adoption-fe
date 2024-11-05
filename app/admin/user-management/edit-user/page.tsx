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
import Layout from "../../../components/Layout";
import { updateUser, getUserById } from "../../../services/userService";
import { User } from "../../../types/user";
import { useSearchParams } from "next/navigation";
import { Alert } from "@mui/material";

const EditUser = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    userName: "",
    age: "",
    breed: "",
    gender: "",
    description: "",
    rescuedDate: "",
    shelterId: "",
    shelterName: "",
    userImages: null,
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
    return null;
  }
  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
        Edit User <b> {newUser.userName}</b>
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
          <Grid item xs={4}>
            <TextField
              label="User Name"
              value={newUser.userName}
              onChange={(e) =>
                setNewUser({ ...newUser, userName: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Breed"
              value={newUser.breed}
              onChange={(e) =>
                setNewUser({ ...newUser, breed: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Age"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="gender-id-label">Gender</InputLabel>
              <Select
                labelId="gender-id-label"
                value={newUser.gender}
                onChange={(e) =>
                  setNewUser({ ...newUser, gender: e.target.value })
                }
              >
                <MenuItem key="Male" value="Male" selected>
                  Male
                </MenuItem>
                <MenuItem key="Female" value="Female">
                  Female
                </MenuItem>
                <MenuItem key="Other" value="Other">
                  Other
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Description"
              value={newUser.description}
              onChange={(e) =>
                setNewUser({ ...newUser, description: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Rescued Date"
              value={newUser.rescuedDate}
              onChange={(e) =>
                setNewUser({ ...newUser, rescuedDate: e.target.value })
              }
              fullWidth
            />
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
