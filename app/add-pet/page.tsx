"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography } from '@mui/material';
import Layout from '../components/Layout';
import { addPet } from '../services/petService';

const AddPet = () => {
  const router = useRouter();
  const [newPet, setNewPet] = useState({ name: '', type: '' });

  const handleAddPet = async () => {
    try {
      await addPet(newPet);
      router.push('/');
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Add New Pet
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Pet Name"
          value={newPet.name}
          onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Pet Type"
          value={newPet.type}
          onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
          sx={{ mr: 1 }}
        />
        <Button variant="contained" onClick={handleAddPet}>
          Add Pet
        </Button>
      </Box>
    </Layout>
  );
};

export default AddPet;