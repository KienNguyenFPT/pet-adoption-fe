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
import Layout from "../../../components/Layout";
import { addPet } from "../../../services/petService";
import { Pet } from "../../../types/pet";
import { getAllShelters } from "@/app/services/shelterService";
import { Shelter } from "@/app/types/shelter";

const AddPet = () => {
  const router = useRouter();
  const [newPet, setNewPet] = useState<Omit<Pet, "id">>({
    petName: "",
    age: "",
    breed: "",
    gender: "",
    description: "",
    rescuedDate: null,
    shelterId: "",
    shelterName: "",
    petImages: [],
  });
  const [shelters, setShelters] = useState<Shelter[]>([]);

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
      console.error("Error adding pet:", error);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Add New Pet
      </Typography>
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
              <InputLabel id="shelter-id-label">Shelter</InputLabel>
              <Select
                labelId="shelter-id-label"
                value={newPet.shelterId}
                onChange={(e) =>
                  setNewPet({ ...newPet, shelterId: e.target.value })
                }
              >
                {shelters.map((shelter) => (
                  <MenuItem key={shelter.id} value={shelter.id}>
                    {shelter.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Image"
              value={newPet.petImages}
              onChange={(e) =>
                setNewPet({ ...newPet, petImages: e.target.value })
              }
              fullWidth
            />
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
