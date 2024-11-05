/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import moment from "moment";
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
import Layout from "../../../components/Layout";
import {
  updateEvent,
  getEventById,
  addEventImage,
} from "../../../services/eventService";
import { Event } from "../../../types/event";
import { useSearchParams } from "next/navigation";
import { Alert } from "@mui/material";

const EditEvent = () => {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, "images">>({
    id: "",
    eventName: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    eventType: 0,
    eventStatus: 0,
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {}, []);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      getEventById(id).then((response) => {
        setEvent(response.data);
        setNewEvent(response.data);
      });
    }
  }, [id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (id && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const uploadedImage = await addEventImage(id, file);
        if (uploadedImage.success) {
          setNotification({
            message: "Image successfully uploaded",
            type: "success",
          });
        } else {
          setNotification({
            message: "Failed to upload image",
            type: "error",
          });
        }
        // setNewPet({ ...newPet, petImages: [uploadedImage.filePath] });
      } catch (error) {
        setNotification({
          message: "Failed to upload image.",
          type: "error",
        });
        console.error("Error uploading image:", error);
      }
    }
  };
  const handleUpdateEvent = async () => {
    if (event) {
      try {
        await updateEvent({ ...event, ...newEvent });
        router.push("/admin/event-management");
      } catch (error) {
        setNotification({
          message: "Failed to updating event.",
          type: "error",
        });
        console.error("Error updating event:", error);
      }
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
        Edit Event <b> {newEvent.eventName}</b>
      </Typography>
      <div style={{ marginBottom: "15px" }}>
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
              label="Name"
              value={newEvent.eventName}
              onChange={(e) =>
                setNewEvent({ ...newEvent, eventName: e.target.value })
              }
              fullWidth
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
                <MenuItem key="Active" value="1" selected>
                  Active
                </MenuItem>
                <MenuItem key="Inactive" value="0">
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
            />
          </Grid>
          <Grid item xs={4}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleUpdateEvent} sx={{ mt: 2 }}>
          Update Event
        </Button>
      </Box>
    </Layout>
  );
};

export default EditEvent;
