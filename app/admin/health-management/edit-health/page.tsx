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
import { updateHealth, getHealthById } from "@/app/services/petHealthService";
import { Health } from "@/app/types/health";
import { Alert } from "@mui/material";
import { getAllPets } from "@/app/services/petService";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import { Pet } from "@/app/types/pet";

const AddHealth = () => {
  const router = useRouter();
  const [newHealth, setNewHealth] = useState<Omit<Health, "petName">>({
    id: "",
    shortDescription: "",
    vaccineStatus: 0,
    date: "",
    petId: "",
  });
  const [pets, setPet] = useState<Pet[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const getShelters = async () => {
      try {
        const response = await getAllPets();
        setPet(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    getShelters();
  }, []);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      getHealthById(id).then((response) => {
        setNewHealth({
          ...response,
          date: moment(new Date(response.date)).format("YYYY-MM-DD"),
        });
      });
    }
  }, [id]);

  const handleAddHealth = async () => {
    try {
      await updateHealth(newHealth);
      router.push("/admin/health-management");
    } catch (error) {
      setNotification({ message: "Failed to editing health.", type: "error" });
      console.error("Error editing health:", error);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
        Edit Health
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
            <TextField
              label="Description"
              value={newHealth.shortDescription}
              onChange={(e) =>
                setNewHealth({ ...newHealth, shortDescription: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Date"
              value={newHealth.date}
              onChange={(e) =>
                setNewHealth({ ...newHealth, date: e.target.value })
              }
              fullWidth
              placeholder="YYYY-MM-DD"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="gender-id-label">Select Vaccine</InputLabel>
              <Select
                labelId="gender-id-label"
                value={newHealth.vaccineStatus}
                onChange={(e) =>
                  setNewHealth({ ...newHealth, vaccineStatus: +e.target.value })
                }
              >
                <MenuItem key="false" value="0">
                  Have not been vaccinated
                </MenuItem>
                <MenuItem key="true" value="1" selected>
                  Have been vaccinated
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="pet-id-label">Select Pet</InputLabel>
              <Select
                labelId="pet-id-label"
                value={newHealth.petId}
                onChange={(e) =>
                  setNewHealth({ ...newHealth, petId: e.target.value })
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
        </Grid>
        <Button variant="contained" onClick={handleAddHealth} sx={{ mt: 2 }}>
          Update Health
        </Button>
      </Box>
    </Layout>
  );
};

export default AddHealth;
