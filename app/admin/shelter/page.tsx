"use client";

import React, { useState, useEffect } from "react";
import { Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { deleteShelter, getAllShelters } from "../../services/shelterService";
import MUIDataTable from "mui-datatables";
import { Shelter } from "../../types/shelter";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { TableShelterColumns } from "./shelter-constant";
import { Alert } from "@mui/material";

const ShelterManagement = () => {
  const router = useRouter();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchShelters = async () => {
    try {
      const res = await getAllShelters();

      if (res && res.success) {
        setShelters(res.data as Shelter[]);
      } else {
        setNotification({ message: "Failed to fetch shelters", type: "error" });
      }
    } catch (error) {
      console.error("Error fetching shelters:", error);
      setNotification({ message: "Failed to fetch shelters.", type: "error" });
    }
  };

  const handleEditShelter = (id: string) => {
    router.push(`/admin/shelter/edit-shelter?id=${id}`);
  };

  const handleDeleteShelter = async (id: string) => {
    try {
      await deleteShelter(id);
      setShelters(shelters.filter((shelter) => shelter.id !== id));
      setNotification({
        message: "Shelter deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting shelter:", error);
      setNotification({ message: "Failed to delete shelter.", type: "error" });
    }
  };
  useEffect(() => {
    fetchShelters();
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
    ...TableShelterColumns,
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string, tableMeta: { rowData: string[] }) => {
          return (
            <>
              {["Staff"].includes(localStorage.getItem("role") || "") && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <IconButton
                    onClick={() => handleEditShelter(tableMeta.rowData[0])}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteShelter(tableMeta.rowData[0])}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
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
          All Shelter Information
        </Typography>
        {["Staff"].includes(localStorage.getItem("role") || "") && (
          <Button
            sx={{ mr: 2 }}
            variant="contained"
            onClick={() => router.push("/admin/shelter/add-shelter")}
          >
            Add New Shelter
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
      <Box>
        <MUIDataTable
          title={""}
          data={shelters}
          columns={
            ["Staff"].includes(localStorage.getItem("role") || "")
              ? columns
              : TableShelterColumns
          }
          options={{
            download: false,
            responsive: "vertical",
            pagination: true,
            onRowClick: () => {},
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

export default ShelterManagement;
