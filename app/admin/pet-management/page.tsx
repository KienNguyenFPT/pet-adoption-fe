/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TableCell,
  TableRow,
  Typography,
  TableHead,
  Backdrop,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { deletePet, getAllPets } from "../../services/petService";
import MUIDataTable from "mui-datatables";
import { Pet } from "../../types/pet";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { TablePetColumns } from "./pet-constant";
import PreviewIcon from "@mui/icons-material/Preview";
import { Alert } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";

const PetManagement = () => {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const fetchPets = async () => {
    try {
      const res = await getAllPets();

      if (res && res.success) {
        setPets(res.data);
      } else {
        setNotification({ message: "Failed to fetch pets", type: "error" });
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
      setNotification({ message: "Failed to fetch pets.", type: "error" });
    }
  };

  const handleEditPet = (id: string) => {
    router.push(`/admin/pet-management/edit-pet?id=${id}`);
  };
  const handleViewAdoption = (id: string) => {
    router.push(`/admin/adoption?petId=${id}`);
  };
  const handleViewPet = (id: string) => {
    const pet = pets.find((pet) => pet.id === id);
    if (pet) {
      setSelectedPet(pet);
      setOpenDialog(true);
    }
  };

  const handleDeletePet = async (id: string) => {
    try {
      await deletePet(id);
      setPets(pets.filter((pet) => pet.id !== id));
      setNotification({
        message: "Pet deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting pet:", error);
      setNotification({ message: "Failed to delete pet.", type: "error" });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPet(null);
  };
  useEffect(() => {
    fetchPets();
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
    return null;
  }
  const columns = [
    ...TablePetColumns,
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: { rowData: string[] }) => {
          return (
            <>
              <div style={{ display: "flex", gap: "8px" }}>
                {" "}
                <Tooltip title="View">
                  <IconButton
                    onClick={() => handleViewPet(tableMeta.rowData[0])}
                    color="primary"
                  >
                    <PreviewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Adoption">
                  <IconButton
                    onClick={() => handleViewAdoption(tableMeta.rowData[0])}
                    color="primary"
                  >
                    <PreviewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => handleEditPet(tableMeta.rowData[0])}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => handleDeletePet(tableMeta.rowData[0])}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <Dialog
                PaperProps={{
                  style: { width: "600px", maxWidth: "90%" },
                }}
                sx={{
                  "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  },
                }}
                open={openDialog}
                onClose={handleCloseDialog}
              >
                <DialogTitle>
                  <b>VIEW</b>
                </DialogTitle>
                <DialogContent>
                  {selectedPet && (
                    <div>
                      <p>
                        <strong>Name:</strong> {selectedPet.petName}
                      </p>
                      <p>
                        <strong>Age:</strong> {selectedPet.age}
                      </p>
                      <p>
                        <strong>Breed:</strong> {selectedPet.breed}
                      </p>
                      <p>
                        <strong>Gender:</strong> {selectedPet.gender}
                      </p>
                      <p>
                        <strong>Description:</strong> {selectedPet.description}
                      </p>
                      <p>
                        <strong>Rescued Date:</strong>{" "}
                        {selectedPet.rescuedDate
                          ? moment(new Date(selectedPet.rescuedDate)).format(
                              "DD/MM/YYYY"
                            )
                          : ""}
                      </p>
                      <p>
                        <strong>Shelter:</strong> {selectedPet.shelterName}
                      </p>
                      {selectedPet.petImages &&
                        selectedPet.petImages.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                              marginTop: "10px",
                            }}
                          >
                            {selectedPet.petImages.map(
                              (image: any, index: number) => (
                                <img
                                  key={index}
                                  src={image.image}
                                  style={{
                                    width: "150px",
                                    height: "auto",
                                    borderRadius: "8px",
                                  }}
                                />
                              )
                            )}
                          </div>
                        )}
                    </div>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          );
        },
      },
    },
  ];

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
          Pet Management
        </Typography>
        <Button
          sx={{ mr: 2 }}
          variant="contained"
          onClick={() => router.push("/admin/pet-management/add-pet")}
        >
          Add New Pet
        </Button>
      </Box>
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
      <Box>
        <MUIDataTable
          title={""}
          data={pets}
          columns={columns}
          options={{
            download: false,
            responsive: "vertical",
            pagination: true,
            onRowClick: (rowData: any) => {
              console.log("Row clicked:", rowData);
            },
            print: false,
            fixedHeader: true,
            selectableRows: "none",
            rowsPerPage: 5,
            rowsPerPageOptions: [5, 10, 20, 50, 100],
          }}
        />
      </Box>
    </Layout>
  );
};

export default PetManagement;
