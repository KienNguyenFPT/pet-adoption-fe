"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import {
  deleteEvent,
  deleteEventImage,
  getAllEventImages,
  getAllEvents,
} from "../../services/eventService";
import MUIDataTable from "mui-datatables";
import { Event } from "../../types/event";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { TableEventColumns } from "./event-constant";
import PreviewIcon from "@mui/icons-material/Preview";
import { Alert } from "@mui/material";
import moment from "moment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Image } from "@/app/types/common";

const EventManagement = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [role, setRole] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    action: string | null;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setRole(localStorage.getItem("role") || "");
    if (!accessToken || !["Staff", "Administrator"].includes(role)) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();

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

  const handleEditEvent = (id: string) => {
    router.push(`/admin/event/edit-event?id=${id}`);
  };
  const handleViewEvent = async (id: string) => {
    const event = events.find((event) => event.id === id);
    if (event) {
      try {
        const res = await getAllEventImages(id);
        console.log(res);

        if (res && res.success) {
          setImages(res.data as Image[]);
          setSelectedEvent(event);
          setOpenDialog(true);
        } else {
          setNotification({
            message: "Failed to fetch images",
            action: "view",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setNotification({
          message: "Failed to fetch images.",
          action: "view",
          type: "error",
        });
      }
    }
  };
  const handleDeleteEventImage = async (idEvent: string, idPhoto: string) => {
    try {
      await deleteEventImage(idEvent, idPhoto);
      setImages(images.filter((i) => i.id !== idPhoto));
      setNotification({
        message: "Image deleted successfully!",
        action: "delete-photo",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      setNotification({
        message: "Failed to delete image.",
        action: "delete-photo",
        type: "error",
      });
    }
  };
  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((event) => event.id !== id));
      setNotification({
        message: "Event deleted successfully!",
        action: "delete",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      setNotification({
        message: "Failed to delete event.",
        action: "delete",
        type: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };
  useEffect(() => {
    fetchEvents();
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
    ...TableEventColumns,
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string, tableMeta: { rowData: string[] }) => {
          console.log(value);
          return (
            <>
              <div style={{ display: "flex", gap: "8px" }}>
                {" "}
                <IconButton
                  onClick={() => handleViewEvent(tableMeta.rowData[0])}
                  color="primary"
                >
                  <PreviewIcon />
                </IconButton>
                {["Staff", "Administrator"].includes(role) && (
                  <>
                    <IconButton
                      onClick={() => handleEditEvent(tableMeta.rowData[0])}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteEvent(tableMeta.rowData[0])}
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
                  {selectedEvent && (
                    <div>
                      <p>
                        <strong>Name:</strong> {selectedEvent.eventName}
                      </p>
                      <p>
                        <strong>Event Type:</strong> {selectedEvent.eventType}
                      </p>
                      <p>
                        <strong>Event Status:</strong>{" "}
                        {selectedEvent.eventStatus == 1 ? "Active" : "Inactive"}
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedEvent.location}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedEvent.description}
                      </p>
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {selectedEvent.startDate
                          ? moment(new Date(selectedEvent.startDate)).format(
                              "DD/MM/YYYY"
                            )
                          : ""}
                      </p>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {selectedEvent.endDate
                          ? moment(new Date(selectedEvent.endDate)).format(
                              "DD/MM/YYYY"
                            )
                          : ""}
                      </p>
                      <div>
                        <div>
                          {notification &&
                            notification.action == "delete-photo" && (
                              <Alert
                                severity={notification.type}
                                onClose={() => setNotification(null)}
                              >
                                {notification.message}
                              </Alert>
                            )}
                        </div>
                      </div>
                      {images.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {images.map((image: Image) => (
                            <div
                              key={image.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <img
                                src={image.imageUrl}
                                style={{
                                  width: "100px",
                                  height: "auto",
                                  borderRadius: "8px",
                                }}
                              />
                              <IconButton
                                onClick={() =>
                                  handleDeleteEventImage(
                                    selectedEvent.id,
                                    image.id || ""
                                  )
                                }
                                color="secondary"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
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
          Event Management
        </Typography>
        {["Staff"].includes(role) && (
          <Button
            sx={{ mr: 2 }}
            variant="contained"
            onClick={() => router.push("/admin/event/add-event")}
          >
            Add New Event
          </Button>
        )}
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
  );
};

export default EventManagement;
