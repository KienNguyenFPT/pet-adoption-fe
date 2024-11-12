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
import { createDonation } from "@/app/services/donationService";
import { Donation } from "@/app/types/donation";
import { getAllShelters } from "@/app/services/shelterService";
import { Alert } from "@mui/material";
import { Shelter } from "@/app/types/shelter";

const AddDonation = () => {
  const router = useRouter();
  const [newDonation, setNewDonation] = useState<Omit<Donation, "id">>({
    money: 0,
    date: new Date().toISOString(),
    shelterId: "",
    shelterAddress: "",
    transactionId: "",
    paymentStatus: "Created",
  });
  const [shelters, setShelters] = useState<Shelter[]>([]);
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
    const getShelters = async () => {
      try {
        const response = await getAllShelters();
        setShelters(response.data as Shelter[]);
      } catch (error) {
        console.error("Error fetching shelters:", error);
      }
    };

    getShelters();
  }, []);
  const handleCreateDonation = async () => {
    try {
      if (!newDonation.shelterId) {
        setNotification({ message: "Please select a shelter", type: "error" });
      } else if (newDonation.money <= 0) {
        setNotification({ message: "Money invalid", type: "error" });
      } else {
        await createDonation(newDonation);
        router.push("/admin/my-donation");
      }
    } catch (error) {
      setNotification({
        message: "Failed to creating donation.",
        type: "error",
      });
      console.error("Error creating donation:", error);
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
        Create Donation
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
              <InputLabel id="shelter-id-label">Select Shelter</InputLabel>
              <Select
                labelId="shelter-id-label"
                value={newDonation.shelterId}
                onChange={(e) =>
                  setNewDonation({ ...newDonation, shelterId: e.target.value })
                }
              >
                {shelters.map((shelter) => (
                  <MenuItem key={shelter.id} value={shelter.id}>
                    {shelter.address}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Amount"
              value={newDonation.money}
              onChange={(e) =>
                setNewDonation({ ...newDonation, money: +e.target.value })
              }
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          onClick={handleCreateDonation}
          sx={{ mt: 2 }}
        >
          Donation
        </Button>
      </Box>
    </Layout>
  );
};

export default AddDonation;
