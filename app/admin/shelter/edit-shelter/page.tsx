/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Layout from "../../../components/Layout";
import { updateShelter } from "../../../services/shelterService";
import { Shelter } from "../../../types/shelter";
import { getAllShelters } from "@/app/services/shelterService";
import { useSearchParams } from "next/navigation";
import { Alert } from "@mui/material";

const EditShelter = () => {
  const router = useRouter();
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [newShelter, setNewShelter] = useState<Omit<Shelter, "id">>({
    name: "",
    address: "",
    description: "",
    limitedCapacity: 0,
    currentCapacity: 0,
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const getShelters = async () => {
      try {
        const response = await getAllShelters();
        if (response.data?.length > 0) {
          const sh = response.data.find((s: Shelter) => s.id == id);
          console.log(sh);

          setShelter(sh);
          setNewShelter(sh);
        }
      } catch (error) {
        setNotification({
          message: "Failed to fetch shelters.",
          type: "error",
        });
        console.error("Error fetching shelters:", error);
      }
    };

    getShelters();
  }, [id]);

  const handleUpdateShelter = async () => {
    if (shelter) {
      try {
        await updateShelter({ ...shelter, ...newShelter });
        router.push("/admin/shelter");
      } catch (error) {
        setNotification({
          message: "Failed to updating shelter.",
          type: "error",
        });
        console.error("Error updating shelter:", error);
      }
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
        Edit Shelter
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
              label="Address"
              value={newShelter.address}
              onChange={(e) =>
                setNewShelter({ ...newShelter, address: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Limited Capacity"
              value={newShelter.limitedCapacity}
              onChange={(e) =>
                setNewShelter({
                  ...newShelter,
                  limitedCapacity: +e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Current Capacity"
              value={newShelter.currentCapacity}
              onChange={(e) =>
                setNewShelter({
                  ...newShelter,
                  currentCapacity: +e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={newShelter.description}
              onChange={(e) =>
                setNewShelter({ ...newShelter, description: e.target.value })
              }
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          onClick={handleUpdateShelter}
          sx={{ mt: 2 }}
        >
          Update
        </Button>
      </Box>
    </Layout>
  );
};

export default EditShelter;
