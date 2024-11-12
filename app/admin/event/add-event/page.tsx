"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Layout from "@/app/components/Layout";
import moment from "moment";
import { addEvent } from "@/app/services/eventService";
import { Event } from "@/app/types/event";
import { Alert } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
const AddEvent = () => {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEvent, setNewEvent] = useState<Omit<Event, "images">>({
    id: uuidv4(),
    eventName: "",
    startDate: moment(new Date()).format("YYYY-MM-DD"),
    endDate: moment(new Date()).add(1, "d").format("YYYY-MM-DD"),
    location: "",
    description: "",
    eventType: null,
    eventStatus: 1,
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (
      !accessToken ||
      !["Staff", "Administrator"].includes(
        localStorage.getItem("role") as string
      )
    ) {
      router.push("/admin/login");
    } else {
      setRole(localStorage.getItem("role") || "");
      console.log(role);

      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const handleAddEvent = async () => {
    try {
      if (newEvent.eventName == "") {
        setNotification({
          message: "Please enter event name",
          type: "error",
        });
      }
      if (
        newEvent.startDate &&
        newEvent.endDate &&
        moment(newEvent.startDate).isAfter(moment(newEvent.endDate))
      ) {
        setNotification({
          message: "End date must be after start date",
          type: "error",
        });
      } else {
        await addEvent(newEvent);
        router.push("/admin/event");
      }
    } catch (error) {
      setNotification({ message: "Failed to adding event.", type: "error" });
      console.error("Error adding event:", error);
    }
  };
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
  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
        Add New Event
      </Typography>
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
      <Box component="form" sx={{ m: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Input Event Name"
              value={newEvent.eventName}
              onChange={(e) =>
                setNewEvent({ ...newEvent, eventName: e.target.value })
              }
              fullWidth
              required={true}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Type"
              value={newEvent.eventType}
              onChange={(e) =>
                setNewEvent({ ...newEvent, eventType: +e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Location"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="gender-id-label">Status</InputLabel>
              <Select
                labelId="gender-id-label"
                value={newEvent.eventStatus}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, eventStatus: +e.target.value })
                }
              >
                <MenuItem key="Active" value="0" selected>
                  Active
                </MenuItem>
                <MenuItem key="Inactive" value="1">
                  Inactive
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Start Date"
              value={newEvent.startDate}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startDate: e.target.value })
              }
              fullWidth
              placeholder="YYYY-MM-DD"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="End Date"
              value={newEvent.endDate}
              onChange={(e) =>
                setNewEvent({ ...newEvent, endDate: e.target.value })
              }
              fullWidth
              placeholder="YYYY-MM-DD"
            />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleAddEvent} sx={{ mt: 2 }}>
          Add Event
        </Button>
      </Box>
    </Layout>
  );
};

export default AddEvent;
