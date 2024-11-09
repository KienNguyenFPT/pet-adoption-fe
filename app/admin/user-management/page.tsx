/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { deleteUser, getAllUsers } from "../../services/userService";
import MUIDataTable from "mui-datatables";
import { User } from "../../types/user";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { TableUserColumns } from "./user-constant";
import { Alert } from "@mui/material";
import moment from "moment";
const UserManagement = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || localStorage.getItem("role") != "Administrator") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();

      if (res && res.success) {
        setUsers(res.data);
      } else {
        setNotification({ message: "Failed to fetch users", type: "error" });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setNotification({ message: "Failed to fetch users.", type: "error" });
    }
  };

  const handleEditUser = (id: string) => {
    router.push(`/admin/user-management/edit-user?id=${id}`);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      setNotification({
        message: "User deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setNotification({ message: "Failed to delete user.", type: "error" });
    }
  };

  useEffect(() => {
    fetchUsers();
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
    ...TableUserColumns,
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
                <IconButton
                  onClick={() => handleEditUser(tableMeta.rowData[0])}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                {localStorage.getItem("role") == "Administrator" && (
                  <IconButton
                    onClick={() => handleDeleteUser(tableMeta.rowData[0])}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
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
          User Management
        </Typography>
        <Button
          sx={{ mr: 2 }}
          variant="contained"
          onClick={() => router.push("/admin/user-management/add-user")}
        >
          Add New User
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
          data={users}
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

export default UserManagement;
