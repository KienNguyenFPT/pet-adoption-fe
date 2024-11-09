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
import { addAdoption } from "@/app/services/adoptionService";
import { Adoption } from "@/app/types/adoption";
import { getAllPets } from "@/app/services/petService";
import { Alert } from "@mui/material";
import { Pet } from "@/app/types/pet";

const AddAdoption = () => {
  const router = useRouter();
  const [newAdoption, setNewAdoption] = useState<Omit<Adoption, "id">>({
    applicationDate: "",
    approvalDate: "",
    adoptionStatus: 0,
    adoptionReason: "",
    petExperience: "",
    address: "",
    contactNumber: "",
    notes: "",
    userEmail: "",
    userId: "",
    petId: "",
    petName: "",
    petImages: "",
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (
      !accessToken ||
      !["User"].includes(localStorage.getItem("role") || "")
    ) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);
  useEffect(() => {
    const getPets = async () => {
      try {
        const response = await getAllPets();
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    getPets();
  }, []);
  const handleAddAdoption = async () => {
    try {
      await addAdoption(newAdoption);
      router.push("/admin/adoption");
    } catch (error) {
      setNotification({ message: "Failed to adding adoption.", type: "error" });
      console.error("Error adding adoption:", error);
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
        Add New Adoption Form
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
            <FormControl fullWidth>
              <InputLabel id="pet-id-label">Select Pet</InputLabel>
              <Select
                labelId="pet-id-label"
                value={newAdoption.petId}
                onChange={(e) =>
                  setNewAdoption({ ...newAdoption, petId: e.target.value })
                }
              >
                {pets.map((pet) => (
                  <MenuItem key={pet.id} value={pet.id}>
                    {pet.petName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Pet Experience"
              value={newAdoption.petExperience}
              onChange={(e) =>
                setNewAdoption({
                  ...newAdoption,
                  petExperience: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Address"
              value={newAdoption.address}
              onChange={(e) =>
                setNewAdoption({ ...newAdoption, address: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="User Email"
              value={newAdoption.userEmail}
              onChange={(e) =>
                setNewAdoption({ ...newAdoption, userEmail: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Adoption Reason"
              value={newAdoption.adoptionReason}
              onChange={(e) =>
                setNewAdoption({
                  ...newAdoption,
                  adoptionReason: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Contact Number"
              value={newAdoption.contactNumber}
              onChange={(e) =>
                setNewAdoption({
                  ...newAdoption,
                  contactNumber: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Notes"
              value={newAdoption.notes}
              onChange={(e) =>
                setNewAdoption({ ...newAdoption, notes: e.target.value })
              }
              fullWidth
            />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleAddAdoption} sx={{ mt: 2 }}>
          Add Adoption
        </Button>
      </Box>
    </Layout>
  );
};

export default AddAdoption;
