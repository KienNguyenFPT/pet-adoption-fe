"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Alert,
} from "@mui/material";
import Layout from "@/app/components/Layout";
import {
  updateAdoption,
  getAdoptionById,
} from "@/app/services/adoptionService";
import { Adoption } from "@/app/types/adoption";
import { getAllPets } from "@/app/services/petService";
import { Pet } from "@/app/types/pet";

const EditAdoption = () => {
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
    petImages: [],
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
        if (!response || !response.success) {
          setNotification({
            message: "Failed to get adoption.",
            type: "error",
          });
        } else {
          const ad: Adoption = response.data as Adoption;
          setNewAdoption({
            ...ad,
            applicationDate: moment(new Date(ad?.applicationDate)).format(
              "YYYY-MM-DD"
            ),
            approvalDate: moment(new Date(ad?.approvalDate)).format(
              "YYYY-MM-DD"
            ),
          });
        }
      });
    }
  }, [id]);

  useEffect(() => {
    const getPets = async () => {
      try {
        const response = await getAllPets();
        setPets(response.data as Pet[]);
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
  if (isLoading) {
    return (
      <Suspense>
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
      </Suspense>
    );
  }
  if (!isAuthenticated) {
    return (
      <Suspense>
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
      </Suspense>
    );
  }
  return (
    <Suspense>
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
            {/* Add other form fields here */}
          </Grid>
          <Button
            variant="contained"
            onClick={handleUpdateAdoption}
            sx={{ mt: 2 }}
          >
            Update
          </Button>
        </Box>
      </Layout>
    </Suspense>
  );
};

export default EditAdoption;
