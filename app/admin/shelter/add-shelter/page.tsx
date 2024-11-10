"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Layout from "@/app/components/Layout";
import { addShelter } from "@/app/services/shelterService";
import { Shelter } from "@/app/types/shelter";
import { getAllShelters } from "@/app/services/shelterService";
import { Alert } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const AddShelter = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const [newShelter, setNewShelter] = useState<Shelter>({
    id: uuidv4(),
    address: "",
    description: "",
    currentCapacity: 0,
    limitedCapacity: 0,
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
  const handleAddShelter = async () => {
    try {
      if (
        !newShelter.limitedCapacity ||
        newShelter.address == "" ||
        newShelter.description == ""
      ) {
        setNotification({
          message:
            "Limit aapacity, address, and description are required fields",
          type: "error",
        });
      } else if (newShelter.currentCapacity > newShelter.limitedCapacity) {
        setNotification({
          message:
            "Current capacity must be less than or equal Limited capacity",
          type: "error",
        });
      } else {
        await addShelter(newShelter);
        router.push("/admin/shelter");
      }
    } catch (error) {
      setNotification({ message: "Failed to adding shelter.", type: "error" });
      console.error("Error adding shelter:", error);
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
        Add New Shelter
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
        <Button variant="contained" onClick={handleAddShelter} sx={{ mt: 2 }}>
          Add
        </Button>
      </Box>
    </Layout>
  );
};

export default AddShelter;
