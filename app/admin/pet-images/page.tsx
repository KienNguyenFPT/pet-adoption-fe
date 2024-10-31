"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import Layout from "../../components/Layout";

const PetImages = () => {
  const [images, setImages] = useState<string[]>([
    "/images/pet1.jpg",
    "/images/pet2.jpg",
    "/images/pet3.jpg",
  ]);

  const handleAddImage = () => {
    const newImage = `/images/pet${images.length + 1}.jpg`;
    setImages([...images, newImage]);
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pet Image Management
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddImage}>
          Add New Image
        </Button>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={image}
                  alt={`Pet ${index + 1}`}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Pet Image {index + 1}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default PetImages;
