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
import moment from "moment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const PetManagement = () => {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

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
        console.log(1234);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleEditPet = (id: string) => {
    const petToEdit = pets.find((pet) => pet.id === id);
    if (petToEdit) {
      console.log("Edit pet:", petToEdit);
    }
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
    } catch (error) {
      console.error("Error deleting pet:", error);
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
                <IconButton
                  onClick={() => handleViewPet(tableMeta.rowData[0])}
                  color="primary"
                >
                  <PreviewIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleEditPet(tableMeta.rowData[0])}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeletePet(tableMeta.rowData[0])}
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
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
                  <h3>VIEW</h3>
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
        <Typography variant="h4" gutterBottom>
          Pet Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/admin/pet-management/add-pet")}
        >
          Add New Pet
        </Button>
      </Box>
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
