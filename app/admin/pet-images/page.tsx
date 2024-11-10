"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { getAllImages, deleteImage } from "../../services/imageService";
import { Image } from "../../types/images";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Alert } from "@mui/material";
const PetImages = () => {
  const router = useRouter();
  const [images, setimages] = useState<Image[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
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

  const fetchimages = async () => {
    try {
      const res = await getAllImages();

      if (res && res.success) {
        setimages(res.data);
      } else {
        setNotification({ message: "Failed to fetch images", type: "error" });
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setNotification({ message: "Failed to fetch images.", type: "error" });
    }
  };
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImage(id);
      setimages(images.filter((Image) => Image.id !== id));
      setNotification({
        message: "Image deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting Image:", error);
      setNotification({ message: "Failed to delete Image.", type: "error" });
    }
  };
  useEffect(() => {
    fetchimages();
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
          Pet Photo
        </Typography>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {images
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((img) => (
                  <TableRow key={img.id}>
                    <TableCell>{img.id}</TableCell>
                    <TableCell>
                      <img
                        src={img.image || undefined}
                        alt="Pet"
                        style={{ width: "200px", height: "auto" }}
                      />
                    </TableCell>
                    {["Administrator", "Staff"].includes(
                      localStorage.getItem("role") || ""
                    ) && (
                      <TableCell>
                        <IconButton onClick={() => handleDeleteImage(img.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={images.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default PetImages;
