"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Layout from "@/app/components/Layout";
import { updateShelter } from "@/app/services/shelterService";
import { Shelter } from "@/app/types/shelter";
import { getAllShelters } from "@/app/services/shelterService";
import { useSearchParams } from "next/navigation";
import { Alert } from "@mui/material";
import { Suspense } from "react";

const EditShelter = () => {
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
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [newShelter, setNewShelter] = useState<Omit<Shelter, "id">>({
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
        if (response.data) {
          const sh: Shelter = (response.data as Shelter[]).find(
            (s: Shelter) => s.id == id
          ) as Shelter;
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
          await updateShelter({ ...shelter, ...newShelter });
          router.push("/admin/shelter");
        }
      } catch (error) {
        setNotification({
          message: "Failed to updating shelter.",
          type: "error",
        });
        console.error("Error updating shelter:", error);
      }
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
    <Suspense>
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
    </Suspense>
  );
};

export default EditShelter;
