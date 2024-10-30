"use client";

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, IconButton, TextField } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Layout from './components/Layout';
import { Pet, getAllPets, updatePet, deletePet } from './services/petService';


const Home = () => {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      // setIsAuthenticated(true);
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  
  const fetchPets = async () => {
    try {
      const pets = await getAllPets();
      setPets(pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleUpdatePet = async (updatedPet: Pet) => {
    try {
      const pet = await updatePet(updatedPet);
      setPets(pets.map(p => (p.id === pet.id ? pet : p)));
      setEditingPet(null);
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const handleDeletePet = async (id: number) => {
    try {
      await deletePet(id);
      setPets(pets.filter(pet => pet.id !== id));
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };
  useEffect(() => {
    fetchPets();
  }, []);

  if (isLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }
  console.log({isAuthenticated})
  if (!isAuthenticated) {
    return null; 
  }



  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Pet Management
      </Typography>
      <Button variant="contained" onClick={() => router.push('/add-pet')}>
        Add New Pet
      </Button>
      <List>
        {pets.map((pet) => (
          <ListItem key={pet.id}>
            {editingPet?.id === pet.id ? (
              <>
                <TextField
                  label="Pet Name"
                  value={editingPet.name}
                  onChange={(e) => setEditingPet({ ...editingPet, name: e.target.value })}
                  sx={{ mr: 1 }}
                />
                <TextField
                  label="Pet Type"
                  value={editingPet.type}
                  onChange={(e) => setEditingPet({ ...editingPet, type: e.target.value })}
                  sx={{ mr: 1 }}
                />
                <Button variant="contained" onClick={() => handleUpdatePet(editingPet)}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <ListItemText primary={`${pet.name} (${pet.type})`} />
                <IconButton onClick={() => setEditingPet(pet)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeletePet(pet.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Layout>
  );
};

export default Home;