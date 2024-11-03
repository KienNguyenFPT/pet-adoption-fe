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
import { deleteHealth, getAllHealth } from "../../services/petHealthService";
import MUIDataTable from "mui-datatables";
import { Health } from "../../types/health";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { TableHealthColumns } from "./health-constant";
import PreviewIcon from "@mui/icons-material/Preview";
import { Alert } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import moment from "moment";
const HealthManagement = () => {
  const router = useRouter();
  const [Healths, setHealths] = useState<Health[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHealth, setSelectedHealth] = useState<Health | null>(null);
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

  const fetchHealths = async () => {
    try {
      const res = await getAllHealth();

      if (res && res.success) {
        setHealths(res.data);
      } else {
        setNotification({
          message: "Failed to fetch Healths",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching Healths:", error);
      setNotification({
        message: "Failed to fetch Healths.",
        type: "error",
      });
    }
  };

  const handleEditHealth = (id: string) => {
    router.push(`/admin/Health-management/edit-Health?id=${id}`);
  };

  const handleViewHealth = (id: string) => {
    const Health = Healths.find((Health) => Health.id === id);
    if (Health) {
      setSelectedHealth(Health);
      setOpenDialog(true);
    }
  };

  const handleDeleteHealth = async (id: string) => {
    try {
      await deleteHealth(id);
      setHealths(Healths.filter((Health) => Health.id !== id));
      setNotification({
        message: "Healthdeleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting Health:", error);
      setNotification({
        message: "Failed to delete Health.",
        type: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHealth(null);
  };
  useEffect(() => {
    fetchHealths();
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
    ...TableHealthColumns,
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
                  onClick={() => handleViewHealth(tableMeta.rowData[0])}
                  color="primary"
                >
                  <PreviewIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleEditHealth(tableMeta.rowData[0])}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteHealth(tableMeta.rowData[0])}
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
                  {selectedHealth && (
                    <div>
                      <p>
                        <strong>Name:</strong> {selectedHealth.healthName}
                      </p>
                      <p>
                        <strong>Age:</strong> {selectedHealth.age}
                      </p>
                      <p>
                        <strong>Breed:</strong> {selectedHealth.breed}
                      </p>
                      <p>
                        <strong>Gender:</strong> {selectedHealth.gender}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedHealth.description}
                      </p>
                      <p>
                        <strong>Rescued Date:</strong>{" "}
                        {selectedHealth.rescuedDate
                          ? moment(new Date(selectedHealth.rescuedDate)).format(
                              "DD/MM/YYYY"
                            )
                          : ""}
                      </p>
                      <p>
                        <strong>Shelter:</strong> {selectedHealth.shelterName}
                      </p>
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
          HealthManagement
        </Typography>
        <Button
          sx={{ mr: 2 }}
          variant="contained"
          onClick={() => router.push("/admin/Health-management/add-Health")}
        >
          Add New Health
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
          data={Healths}
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

export default HealthManagement;
