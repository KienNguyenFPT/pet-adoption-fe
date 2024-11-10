"use client";
import React, { useEffect, useState } from "react";
import { Suspense } from 'react'
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import styles from "./styles.module.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/admin/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ backgroundColor: "cornflowerblue" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pet Admin
          </Typography>
          {username && (
            <>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                Welcome {localStorage.getItem("role")}, {username}
              </Typography>
            </>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <img src="/images/logo.png" alt="Logo" width={100} height={100} />
          </Box>
          <List>
            {["Staff", "Administrator", "User"].includes(
              localStorage.getItem("role") || ""
            ) && (
              <ListItem
                className={styles.listItemButton}
                component="button"
                onClick={() => router.push("/admin/pet-management")}
              >
                <ListItemIcon>
                  <img src="/icons/pet.svg" alt="Home" width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Pets Management" />
              </ListItem>
            )}
            {["Staff", "Administrator"].includes(
              localStorage.getItem("role") || ""
            ) && (
              <ListItem
                className={styles.listItemButton}
                component="button"
                onClick={() => router.push("/admin/pet-images")}
              >
                <ListItemIcon>
                  <img
                    src="/icons/gallery.svg"
                    alt="Pet's Photos"
                    width={24}
                    height={24}
                  />
                </ListItemIcon>
                <ListItemText primary="Pet's Photos" />
              </ListItem>
            )}
            {["Staff", "Administrator"].includes(
              localStorage.getItem("role") || ""
            ) && (
              <ListItem
                className={styles.listItemButton}
                component="button"
                onClick={() => router.push("/admin/health-management")}
              >
                <ListItemIcon>
                  <img
                    src="/icons/health.svg"
                    alt="Pet Heath"
                    width={24}
                    height={24}
                  />
                </ListItemIcon>
                <ListItemText primary="Pet's Heath" />
              </ListItem>
            )}
            {["User", "Staff"].includes(localStorage.getItem("role") || "") && (
              <ListItem
                className={styles.listItemButton}
                component="button"
                onClick={() => router.push("/admin/adoption")}
              >
                <ListItemIcon>
                  <img
                    src="/icons/clients.svg"
                    alt="Adoption"
                    width={24}
                    height={24}
                  />
                </ListItemIcon>
                <ListItemText primary="Adoption" />
              </ListItem>
            )}
            <ListItem
              className={styles.listItemButton}
              component="button"
              onClick={() => router.push("/admin/shelter")}
            >
              <ListItemIcon>
                <img
                  src="/icons/shelter.svg"
                  alt="Shelter"
                  width={24}
                  height={24}
                />
              </ListItemIcon>
              <ListItemText primary="Shelter" />
            </ListItem>
            {["User"].includes(localStorage.getItem("role") || "") && (
              <ListItem
                className={styles.listItemButton}
                component="button"
                onClick={() => router.push("/admin/donation")}
              >
                <ListItemIcon>
                  <img
                    src="/icons/donate.svg"
                    alt="Donation"
                    width={24}
                    height={24}
                  />
                </ListItemIcon>
                <ListItemText primary="Donation" />
              </ListItem>
            )}
            {["Staff", "Administrator"].includes(
              localStorage.getItem("role") || ""
            ) && (
              <ListItem
                className={styles.listItemButton}
                component="button"
                onClick={() => router.push("/admin/event")}
              >
                <ListItemIcon>
                  <img
                    src="/icons/event.svg"
                    alt="Event"
                    width={24}
                    height={24}
                  />
                </ListItemIcon>
                <ListItemText primary="Event Management" />
              </ListItem>
            )}
            {localStorage.getItem("role") == "Administrator" && (
              <ListItem
                className={styles.listItemButton}
                component="button"
                onClick={() => router.push("/admin/user-management")}
              >
                <ListItemIcon>
                  <img
                    src="/icons/user.svg"
                    alt="User Management"
                    width={24}
                    height={24}
                  />
                </ListItemIcon>
                <ListItemText primary="User Setting" />
              </ListItem>
            )}
            <ListItem
              className={styles.listItemButton}
              component="button"
              onClick={() => router.push("/admin/profile")}
            >
              <ListItemIcon>
                <img
                  src="/icons/profile.svg"
                  alt="Profile"
                  width={24}
                  height={24}
                />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            {/* <ListItem className={styles.listItemButton} component="button" onClick={() => router.push('/settings')}>
              <ListItemIcon>
                <img src="/icons/settings.svg" alt="Settings" width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem> */}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, pt: 3, overflowX: "auto" }}>
          <Suspense>
            {children}
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
