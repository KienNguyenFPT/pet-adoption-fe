"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    router.push('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: 'cornflowerblue' }}> {}
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pet Admin
          </Typography>
          {username && (
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              Welcome, {username}
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
            <img src="/images/logo.png" alt="Logo" width={100} height={100} />
          </Box>
          <List>
            <ListItem component="button" onClick={() => router.push('/')}>
              <ListItemIcon>
                <img src="/icons/pet.svg" alt="Home" width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary="Pets Management" />
            </ListItem>
            <ListItem component="button" onClick={() => router.push('/pet-images')}>
              <ListItemIcon>
                <img src="/icons/gallery.svg" alt="Pet Images" width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary="Pet Images" />
            </ListItem>
            <ListItem component="button" onClick={() => router.push('/appointments')}>
              <ListItemIcon>
                <img src="/icons/calendar.svg" alt="Appointments" width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary="Appointments" />
            </ListItem>
            <ListItem component="button" onClick={() => router.push('/clients')}>
              <ListItemIcon>
                <img src="/icons/clients.svg" alt="Clients" width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary="Clients" />
            </ListItem>
            <ListItem component="button" onClick={() => router.push('/settings')}>
              <ListItemIcon>
                <img src="/icons/settings.svg" alt="Settings" width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;