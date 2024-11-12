"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import { getEventsByUser } from "@/app/services/eventService";
import MUIDataTable from "mui-datatables";
import { Event } from "@/app/types/event";
import { TableEventColumns } from "../event-constant";
import { Alert } from "@mui/material";

const EnrolledEvent = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    action: string | null;
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

  const fetchEventsByUser = async () => {
    try {
      const res = await getEventsByUser(userId); // chua co api lay ds event ma user da tham gia

      if (res && res.success) {
        setEvents(res.data as Event[]);
      } else {
        setNotification({
          message: "Failed to fetch events",
          action: "fetch",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setNotification({
        message: "Failed to fetch events.",
        action: "fetch",
        type: "error",
      });
    }
  };
  useEffect(() => {
    if (userId && role == "User") fetchEventsByUser();
  }, [userId]);

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
  const columns = [...TableEventColumns];

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
        <Typography variant="h5" gutterBottom sx={{ ml: 2 }}>
          All Events That You Enrolled
        </Typography>
      </Box>
      <div>
        {notification && notification.action != "delete-photo" && (
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
          data={events}
          columns={columns}
          options={{
            download: false,
            responsive: "vertical",
            pagination: true,
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

export default EnrolledEvent;
