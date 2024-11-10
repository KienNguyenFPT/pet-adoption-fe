"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
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
import { updatePet, getPetById } from "@/app/services/petService";
import { Pet } from "@/app/types/pet";
import { getAllShelters } from "@/app/services/shelterService";
import { Shelter } from "@/app/types/shelter";
import { useSearchParams } from "next/navigation";
import { Alert } from "@mui/material";
import { addImage } from "@/app/services/petService"; // Ensure this import is correct
import { Modal, CircularProgress } from "@mui/material";

const EditPet = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  }, [router]);
  const [pet, setPet] = useState<Pet | null>(null);
  const [newPet, setNewPet] = useState<Omit<Pet, "id">>({
    petName: "",
    age: "",
    breed: "",
    gender: "",
    description: "",
    rescuedDate: "",
    shelterId: "",
    shelterName: "",
    petImages: null,
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
        setNotification({
          message: "Failed to fetch shelters.",
          type: "error",
        });
        console.error("Error fetching shelters:", error);
      }
    };

    getShelters();
  }, []);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      getPetById(id).then((response) => {
        setPet(response.data);
        setNewPet(response.data);
      });
    }
  }, [id]);

  const handleUpdatePet = async () => {
    if (pet) {
      try {
        await updatePet({ ...pet, ...newPet });
        router.push("/admin/pet-management");
      } catch (error) {
        setNotification({
          message: "Failed to updating pet.",
          type: "error",
        });
        console.error("Error updating pet:", error);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    if (id && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const uploadedImage = await addImage(id, file);
        if (uploadedImage.success) {
          setNotification({
            message: "Image successfully uploaded",
            type: "success",
          });
        } else {
          setNotification({
            message: "Failed to upload image",
            type: "error",
          });
        }
        // setNewPet({ ...newPet, petImages: [uploadedImage.filePath] });
      } catch (error) {
        setNotification({
          message: "Failed to upload image.",
          type: "error",
        });
        console.error("Error uploading image:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
        Edit Pet <b> {newPet.petName}</b>
      </Typography>
      <Modal
        open={isLoading}
        aria-labelledby="loading-modal"
        aria-describedby="loading-indicator"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Modal>
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
                <MenuItem key="Male" value="Male">
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
              value={
                newPet.rescuedDate
                  ? moment(new Date(newPet.rescuedDate)).format("YYYY-MM-DD")
                  : ""
              }
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
          <Grid item xs={4}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleUpdatePet} sx={{ mt: 2 }}>
          Update
        </Button>
      </Box>
    </Layout>
  );
};

export default EditPet;
