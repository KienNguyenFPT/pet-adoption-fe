"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { deleteHealth, getAllHealth } from "../../services/petHealthService";
import MUIDataTable from "mui-datatables";
import { Health } from "../../types/health";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { TableHealthColumns } from "./health-constant";
import { Alert } from "@mui/material";
const HealthManagement = () => {
  const router = useRouter();
  const [healths, setHealths] = useState<Health[]>([]);
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
      !["Staff", "Administrator"].includes(localStorage.getItem("role") || "")
    ) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const fetchHealths = async () => {
    try {
      const res = await getAllHealth();
      setHealths(res.data);
    } catch (error) {
      console.error("Error fetching healths:", error);
      setNotification({
        message: "Failed to fetch healths.",
        type: "error",
      });
    }
  };

  const handleEditHealth = (id: string) => {
    router.push(`/admin/health-management/edit-health?id=${id}`);
  };

  const handleDeleteHealth = async (id: string) => {
    try {
      await deleteHealth(id);
      setHealths(healths.filter((health) => health.id !== id));
      setNotification({
        message: "Health deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting health:", error);
      setNotification({
        message: "Failed to delete health.",
        type: "error",
      });
    }
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
  const columns = [
    ...TableHealthColumns,
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string, tableMeta: { rowData: string[] }) => {
          return (
            <>
              {["Staff", "Administrator"].includes(
                localStorage.getItem("role") || ""
              ) && (
                <div style={{ display: "flex", gap: "8px" }}>
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
          Health Management
        </Typography>
        {["Staff"].includes(localStorage.getItem("role") || "") && (
          <Button
            sx={{ mr: 2 }}
            variant="contained"
            onClick={() => router.push("/admin/health-management/add-health")}
          >
            Add New Health
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
          data={healths}
          columns={columns}
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

export default HealthManagement;
