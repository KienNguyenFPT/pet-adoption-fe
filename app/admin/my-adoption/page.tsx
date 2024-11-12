"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { getAdoptionByUserId } from "../../services/adoptionService";
import MUIDataTable from "mui-datatables";
import { Adoption } from "../../types/adoption";
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
import { Suspense } from "react";
import moment from "moment";
import { Image } from "@/app/types/common";

const MyAdoption = () => {
  const router = useRouter();
  const [adoption, setAdoption] = useState<Adoption[]>([]);
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
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
      !["User"].includes(localStorage.getItem("role") as string)
    ) {
      router.push("/admin/login");
    } else {
      setRole(localStorage.getItem("role") || "");
      setUserId(localStorage.getItem("userId") || "");
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    const fetchAdoption = async () => {
      try {
        const res = await getAdoptionByUserId(userId);
        if (res && res.success) {
          setAdoption(res.data as Adoption[]);
        } else {
          setNotification({
            message: "Failed to fetch adoption",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching adoption:", error);
        setNotification({
          message: "Failed to fetch adoption.",
          type: "error",
        });
      }
    };
    if (userId) fetchAdoption();
  }, [userId]);
  const handleViewAdoption = (id: string) => {
    const a = adoption.find((ad) => ad.id === id);
    if (a) {
      setSelectedAdoption(a);
      setOpenDialog(true);
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
            My Adoptions
          </Typography>
          {["User"].includes(role) && (
            <Button
              sx={{ mr: 2 }}
              variant="contained"
              onClick={() => router.push("/admin/my-adoption/add-adoption")}
            >
              Create Adoption
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
            data={adoption}
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

export default MyAdoption;
