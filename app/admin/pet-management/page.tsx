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

const PetManagement = () => {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/admin/login");
      // setIsAuthenticated(true);
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const fetchPets = async () => {
    try {
      // const res = await getAllPets();
      const res = {
        data: [
          {
            id: "2345678-234567890-09876543",
            name: "Pet Name",
            age: "55",
            breed: "23231234",
            gender: "successfully",
            description: "successfully",
            rescuedDate: "successfully",
            shelterId: "successfully",
            shelterName: "successfully",
            petImages: "link",
          },
          {
            id: "234567890-09876543",
            name: "Pet Name",
            age: "13",
            breed: "23231234",
            gender: "successfully",
            description: "successfully",
            rescuedDate: "successfully",
            shelterId: "successfully",
            shelterName: "successfully",
            petImages: "link",
          },
          {
            id: "234567890-09876543",
            name: "Pet Name",
            age: "13",
            breed: "23231234",
            gender: "successfully",
            description: "successfully",
            rescuedDate: "successfully",
            shelterId: "successfully",
            shelterName: "successfully",
            petImages: "link",
          },
          {
            id: "234567890-09876543",
            name: "Pet Name",
            age: "13",
            breed: "23231234",
            gender: "successfully",
            description: "successfully",
            rescuedDate: "successfully",
            shelterId: "successfully",
            shelterName: "successfully",
            petImages: "link",
          },
          {
            id: "234567890-09876543",
            name: "Pet Name",
            age: "13",
            breed: "23231234",
            gender: "successfully",
            description: "successfully",
            rescuedDate: "successfully",
            shelterId: "successfully",
            shelterName: "successfully",
            petImages: "link",
          },
          {
            id: "234567890-09876543",
            name: "Pet Name",
            age: "13",
            breed: "23231234",
            gender: "successfully",
            description: "successfully",
            rescuedDate: "successfully",
            shelterId: "successfully",
            shelterName: "successfully",
            petImages: "link",
          },
          {
            id: "234567890-09876543",
            name: "Pet Name",
            age: "13",
            breed: "23231234",
            gender: "successfully",
            description: "successfully",
            rescuedDate: "successfully",
            shelterId: "successfully",
            shelterName: "successfully",
            petImages: "link",
          },
          {
            id: "234567890-09876543",
            name: "Pet Name",
            age: "13",
            breed: "23231234",
            gender: "successfully",
            description: "successfully",
            rescuedDate: "successfully",
            shelterId: "successfully",
            shelterName: "successfully",
            petImages: "link",
          },
        ],
        success: true,
        message: "Data retrieved successfully",
        error: null,
        errorMessages: null,
      };
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
    const petToEdit = pets.find((pet) => pet.id === id);
    if (petToEdit) {
      console.log("View pet:", petToEdit);
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
          onClick={() => router.push("/admin/add-pet")}
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
