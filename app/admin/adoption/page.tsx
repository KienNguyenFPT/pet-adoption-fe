"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import {
  deleteAdoption,
  getAllAdoptions,
  getAdoptionByPetId,
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
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import moment from "moment";
import { Image } from "@/app/types/common";
import * as _ from "lodash";

const AdoptionManagement = () => {
  const router = useRouter();
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [role, setRole] = useState<string>("");
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
    if (
      !accessToken ||
      !["User", "Staff"].includes(localStorage.getItem("role") as string)
    ) {
      router.push("/admin/login");
    } else {
      setRole(localStorage.getItem("role") || "");
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const searchParams = useSearchParams();
  const petId = searchParams.get("petId");

  useEffect(() => {
    if (petId) {
      try {
        getAdoptionByPetId(petId).then((response) => {
          console.log(response);
          if (!response || !response.success) {
            setNotification({
              message: "Failed to get adoption.",
              type: "error",
            });
          } else if (
            _.get(response.data, "id") ===
            "00000000-0000-0000-0000-000000000000"
          ) {
            setNotification({
              message: "Adoption not found.",
              type: "error",
            });
          } else {
            const ad = response.data as Adoption;
            setAdoptions([
              {
                ...ad,
                applicationDate: moment(new Date(ad.applicationDate)).format(
                  "YYYY-MM-DD"
                ),
                approvalDate: moment(new Date(ad.approvalDate)).format(
                  "YYYY-MM-DD"
                ),
              },
            ]);
          }
        });
      } catch (error) {
        setNotification({
          message: "Failed to fetch adoption",
          type: "error",
        });
        console.log(error);
      }
    } else {
      const fetchAdoptions = async () => {
        try {
          const res = await getAllAdoptions();
          if (res && res.success) {
            setAdoptions(res.data as Adoption[]);
          } else {
            setNotification({
              message: "Failed to fetch adoptions",
              type: "error",
            });
          }
        } catch (error) {
          console.error("Error fetching adoptions:", error);
          setNotification({
            message: "Failed to fetch adoptions.",
            type: "error",
          });
        }
      };
      fetchAdoptions();
    }
  }, [petId]);

  const handleEditAdoption = (id: string) => {
    router.push(`/admin/adoption/edit-adoption?id=${id}`);
  };

  const handleViewAdoption = (id: string) => {
    const adoption = adoptions.find((ad) => ad.id === id);
    if (adoption) {
      setSelectedAdoption(adoption);
      setOpenDialog(true);
    }
  };

  const handleDeleteAdoption = async (id: string) => {
    try {
      await deleteAdoption(id);
      setAdoptions(adoptions.filter((a) => a.id !== id));
      setNotification({
        message: "Adoption deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting adoption:", error);
      setNotification({ message: "Failed to delete adoption.", type: "error" });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAdoption(null);
  };

  if (isLoading) {
    return (
      <Suspense>
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
      </Suspense>
    );
  }
  const columns = [
    ...TableAdoptionColumns,
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string, tableMeta: { rowData: string[] }) => {
          return (
            <>
              <div style={{ display: "flex", gap: "8px" }}>
                <IconButton
                  onClick={() => handleViewAdoption(tableMeta.rowData[0])}
                  color="primary"
                >
                  <PreviewIcon />
                </IconButton>
                {["Staff"].includes(role) && (
                  <>
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
                  </>
                )}
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
                      {[
                        {
                          label: "User Email",
                          value: selectedAdoption.userEmail,
                        },
                        { label: "User Id", value: selectedAdoption.userId },
                        {
                          label: "Adoption Reason",
                          value: selectedAdoption.adoptionReason,
                        },
                        {
                          label: "Pet Experience",
                          value: selectedAdoption.petExperience,
                        },
                        { label: "Address", value: selectedAdoption.address },
                        {
                          label: "Contact Number",
                          value: selectedAdoption.contactNumber,
                        },
                        { label: "Notes", value: selectedAdoption.notes },
                        {
                          label: "Approval Date",
                          value: selectedAdoption.approvalDate
                            ? moment(
                                new Date(selectedAdoption.approvalDate)
                              ).format("DD/MM/YYYY")
                            : "",
                        },
                        {
                          label: "Application Date",
                          value: selectedAdoption.applicationDate
                            ? moment(
                                new Date(selectedAdoption.applicationDate)
                              ).format("DD/MM/YYYY")
                            : "",
                        },
                        { label: "Pet Id", value: selectedAdoption.petId },
                        { label: "Pet Name", value: selectedAdoption.petName },
                      ].map((item, index) => (
                        <p
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <strong>{item.label}:</strong>{" "}
                          <span>{item.value}</span>
                        </p>
                      ))}
                      {selectedAdoption.petImages &&
                        selectedAdoption.petImages.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                              marginTop: "10px",
                            }}
                          >
                            {selectedAdoption.petImages.map(
                              (image: Image, index: number) => (
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
          {["User"].includes(role) && (
            <Button
              sx={{ mr: 2 }}
              variant="contained"
              onClick={() => router.push("/admin/adoption/add-adoption")}
            >
              Add New Adoption
            </Button>
          )}
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
        <Box sx={{ mt: 2 }}>
          <MUIDataTable
            title={""}
            data={adoptions}
            columns={columns}
            options={{
              download: false,
              responsive: "vertical",
              pagination: true,
              onRowClick: (rowData) => {
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
    </Suspense>
  );
};

export default AdoptionManagement;
