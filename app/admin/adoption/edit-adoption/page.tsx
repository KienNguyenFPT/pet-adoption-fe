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
import {
  updateAdoption,
  getAdoptionById,
} from "@/app/services/adoptionService";
import { Adoption } from "@/app/types/adoption";
import { getAllPets } from "@/app/services/petService";
import { Alert } from "@mui/material";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { Pet } from "@/app/types/pet";

const AddAdoption = () => {
  const router = useRouter();
  const [newAdoption, setNewAdoption] = useState<Adoption>({
    id: "",
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pets, setPets] = useState<Pet[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (
      !accessToken ||
      !["Staff"].includes(localStorage.getItem("role") || "")
    ) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  useEffect(() => {
    if (id) {
      getAdoptionById(id).then((response) => {
        console.log(response);
        if (!response || !response.success) {
          setNotification({
            message: "Failed to get adoption.",
            type: "error",
          });
        }
        setNewAdoption({
          ...response.data,
          applicationDate: moment(
            new Date(response.data?.applicationDate)
          ).format("YYYY-MM-DD"),
          approvalDate: moment(new Date(response.data?.approvalDate)).format(
            "YYYY-MM-DD"
          ),
        });
      });
    }
  }, [id]);
  useEffect(() => {
    const getPets = async () => {
      try {
        const response = await getAllPets();
        setPets(response.data);
      } catch (error) {
        setNotification({
          message: "Failed to fetching pets.",
          type: "error",
        });
        console.error("Error fetching pets:", error);
      }
    };

    getPets();
  }, []);
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
        You do not have to permissions to view this page.
      </div>
    );
  }

  const handleUpdateAdoption = async () => {
    try {
      await updateAdoption(newAdoption);
      router.push("/admin/adoption");
    } catch (error) {
      setNotification({
        message: "Failed to editing adoption.",
        type: "error",
      });
      console.error("Error editing adoption:", error);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
        Edit Adoption Form
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
      <Box component="form" sx={{ m: 2 }}>
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
        <Button
          variant="contained"
          onClick={handleUpdateAdoption}
          sx={{ mt: 2 }}
        >
          Edit Adoption
        </Button>
      </Box>
    </Layout>
  );
};

export default AddAdoption;
