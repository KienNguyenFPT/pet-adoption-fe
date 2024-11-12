"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { getDonationByUserId } from "../../services/donationService";
import MUIDataTable from "mui-datatables";
import { Donation } from "../../types/donation";
import { IconButton } from "@mui/material";
import { TableDonationColumns } from "./donation-constant";
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

const MyDonation = () => {
  const router = useRouter();
  const [donation, setDonation] = useState<Donation[]>([]);
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
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
    const fetchDonation = async () => {
      try {
        const res = await getDonationByUserId(userId);
        if (res && res.success) {
          console.log(res.data);

          setDonation(res.data as Donation[]);
        } else {
          setNotification({
            message: "Failed to fetch donation",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching donation:", error);
        setNotification({
          message: "Failed to fetch donation.",
          type: "error",
        });
      }
    };
    if (userId) fetchDonation();
  }, [userId]);
  const handleViewDonation = (transactionId: string) => {
    const a = donation.find((ad) => ad.transactionId === transactionId);
    if (a) {
      setSelectedDonation(a);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDonation(null);
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
    ...TableDonationColumns,
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
                  onClick={() => handleViewDonation(tableMeta.rowData[3])}
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
                  {selectedDonation && (
                    <div>
                      {[
                        {
                          label: "Shelter Id",
                          value: selectedDonation.shelterId,
                        },
                        {
                          label: "Shelter Address",
                          value: selectedDonation.shelterAddress,
                        },
                        {
                          label: "Amount",
                          value: selectedDonation.money,
                        },
                        {
                          label: "Transaction ID",
                          value: selectedDonation.transactionId,
                        },
                        {
                          label: "Payment Status",
                          value: selectedDonation.paymentStatus,
                        },

                        {
                          label: "Payment Date",
                          value: selectedDonation.date
                            ? moment(new Date(selectedDonation.date)).format(
                                "DD/MM/YYYY HH:mm:ss"
                              )
                            : "",
                        },
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
            My Donations
          </Typography>
          {["User"].includes(role) && (
            <Button
              sx={{ mr: 2 }}
              variant="contained"
              onClick={() => router.push("/admin/my-donation/create-donation")}
            >
              Create Donation
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
            data={donation}
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

export default MyDonation;
