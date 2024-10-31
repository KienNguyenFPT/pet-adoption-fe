"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography } from "@mui/material";
import Layout from "../../components/Layout";
import { addPet } from "../../services/petService";
import { Pet } from "../../types/pet";

const AddPet = () => {
  const router = useRouter();
  const [newPet, setNewPet] = useState<Omit<Pet, "id">>({
    petName: "",
    age: "",
    breed: "",
    gender: "",
    description: "",
    rescuedDate: "",
    shelterId: "",
    shelterName: "",
    petImages: [],
  });

  const handleAddPet = async () => {
    try {
      await addPet(newPet);
      router.push("/");
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Add New Pet
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Pet Name"
          value={newPet.petName}
          onChange={(e) => setNewPet({ ...newPet, petName: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Pet Type"
          value={newPet.breed}
          onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Age"
          value={newPet.age}
          onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Gender"
          value={newPet.gender}
          onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Description"
          value={newPet.description}
          onChange={(e) =>
            setNewPet({ ...newPet, description: e.target.value })
          }
          sx={{ mr: 1 }}
        />
        <TextField
          label="Rescued Date"
          value={newPet.rescuedDate}
          onChange={(e) =>
            setNewPet({ ...newPet, rescuedDate: e.target.value })
          }
          sx={{ mr: 1 }}
        />
        <TextField
          label="Shelter ID"
          value={newPet.shelterId}
          onChange={(e) => setNewPet({ ...newPet, shelterId: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Shelter Name"
          value={newPet.shelterName}
          onChange={(e) =>
            setNewPet({ ...newPet, shelterName: e.target.value })
          }
          sx={{ mr: 1 }}
        />
        <Button variant="contained" onClick={handleAddPet}>
          Add Pet
        </Button>
      </Box>
    </Layout>
  );
};

export default AddPet;
