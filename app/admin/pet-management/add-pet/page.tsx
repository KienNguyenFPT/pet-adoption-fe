/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { addPet } from "@/app/services/petService";
import { Pet } from "@/app/types/pet";
import { getAllShelters } from "@/app/services/shelterService";
import { Shelter } from "@/app/types/shelter";
import { Alert } from "@mui/material";
import moment from "moment";

const AddPet = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (
      !accessToken ||
      !["Administrator", "Staff"].includes(localStorage.getItem("role") || "")
    ) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);
  const [newPet, setNewPet] = useState<Omit<Pet, "id">>({
    petName: "",
    age: "",
    breed: "",
    gender: "",
    description: "",
    rescuedDate: moment(new Date()).format("YYYY-MM-DD"),
    shelterId: "",
    shelterName: "",
    petImages: [],
  });
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const getShelters = async () => {
      try {
        const response = await getAllShelters();
        setShelters(response.data);
      } catch (error) {
        console.error("Error fetching shelters:", error);
      }
    };

    getShelters();
  }, []);
  const handleAddPet = async () => {
    try {
      await addPet(newPet);
      router.push("/admin/pet-management");
    } catch (error) {
      setNotification({ message: "Failed to adding pet.", type: "error" });
      console.error("Error adding pet:", error);
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
        Add New Pet
      </Typography>
      <div>
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
              label="Pet Name"
              value={newPet.petName}
              onChange={(e) =>
                setNewPet({ ...newPet, petName: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Breed"
              value={newPet.breed}
              onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Age"
              value={newPet.age}
              onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="gender-id-label">Gender</InputLabel>
              <Select
                labelId="gender-id-label"
                value={newPet.gender}
                onChange={(e) =>
                  setNewPet({ ...newPet, gender: e.target.value })
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
              value={newPet.description}
              onChange={(e) =>
                setNewPet({ ...newPet, description: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Rescued Date"
              value={newPet.rescuedDate}
              onChange={(e) =>
                setNewPet({ ...newPet, rescuedDate: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="shelter-id-label">Shelter Address</InputLabel>
              <Select
                labelId="shelter-id-label"
                value={newPet.shelterId}
                onChange={(e) =>
                  setNewPet({ ...newPet, shelterId: e.target.value })
                }
              >
                {shelters.map((shelter: Shelter) => (
                  <MenuItem key={shelter.id} value={shelter.id}>
                    {shelter.address}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleAddPet} sx={{ mt: 2 }}>
          Add Pet
        </Button>
      </Box>
    </Layout>
  );
};

export default AddPet;
