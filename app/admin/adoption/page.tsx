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
import {
  deleteAdoption,
  getAllAdoptions,
} from "../../services/adoptionService";
import MUIDataTable from "mui-datatables";
import { Adoption } from "../../types/adoption";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { TableAdoptionColumns } from "./adoption-constant";
import PreviewIcon from "@mui/icons-material/Preview";
import { Alert } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import moment from "moment";
const AdoptionManagement = () => {
  const router = useRouter();
  const [Adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdoption, setSelectedAdoption] = useState<Adoption | null>(
    null
  );
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

  const fetchAdoptions = async () => {
    try {
      const res = await getAllAdoptions();
      console.log(res);

      if (res && res.success) {
        setAdoptions(res.data);
      } else {
        setNotification({
          message: "Failed to fetch Adoptions",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching Adoptions:", error);
      setNotification({ message: "Failed to fetch Adoptions.", type: "error" });
    }
  };

  const handleEditAdoption = (id: string) => {
    router.push(`/admin/Adoption-management/edit-Adoption?id=${id}`);
  };

  const handleViewAdoption = (id: string) => {
    const Adoption = Adoptions.find((Adoption) => Adoption.id === id);
    if (Adoption) {
      setSelectedAdoption(Adoption);
      setOpenDialog(true);
    }
  };

  const handleDeleteAdoption = async (id: string) => {
    try {
      await deleteAdoption(id);
      setAdoptions(Adoptions.filter((Adoption) => Adoption.id !== id));
      setNotification({
        message: "Adoption deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting Adoption:", error);
      setNotification({ message: "Failed to delete Adoption.", type: "error" });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAdoption(null);
  };
  useEffect(() => {
    fetchAdoptions();
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
    ...TableAdoptionColumns,
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
                  onClick={() => handleViewAdoption(tableMeta.rowData[0])}
                  color="primary"
                >
                  <PreviewIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleEditAdoption(tableMeta.rowData[0])}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteAdoption(tableMeta.rowData[0])}
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
                  <b>VIEW</b>
                </DialogTitle>
                <DialogContent>
                  {selectedAdoption && (
                    <div>
                      <p>
                        <strong>Name:</strong> {selectedAdoption.AdoptionName}
                      </p>
                      <p>
                        <strong>Age:</strong> {selectedAdoption.age}
                      </p>
                      <p>
                        <strong>Breed:</strong> {selectedAdoption.breed}
                      </p>
                      <p>
                        <strong>Gender:</strong> {selectedAdoption.gender}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedAdoption.description}
                      </p>
                      <p>
                        <strong>Rescued Date:</strong>{" "}
                        {selectedAdoption.rescuedDate
                          ? moment(
                              new Date(selectedAdoption.rescuedDate)
                            ).format("DD/MM/YYYY")
                          : ""}
                      </p>
                      <p>
                        <strong>Shelter:</strong> {selectedAdoption.shelterName}
                      </p>
                      {selectedAdoption.AdoptionImages &&
                        selectedAdoption.AdoptionImages.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                              marginTop: "10px",
                            }}
                          >
                            {selectedAdoption.AdoptionImages.map(
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
          Adoption Management
        </Typography>
        <Button
          sx={{ mr: 2 }}
          variant="contained"
          onClick={() => router.push("/admin/Adoption-management/add-Adoption")}
        >
          Add New Adoption
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
          data={Adoptions}
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

export default AdoptionManagement;
