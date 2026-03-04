import { Link } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import ControlPanel from "./ControlPanel";
import logo from "../assets/logo.jpeg";
import { useState } from "react";

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: open
          ? "90px 1fr 260px 220px"
          : "50px 1fr 260px 220px",
        height: "100vh",
        overflow: "hidden",
        transition: "grid-template-columns 0.3s ease",
        background: "linear-gradient(180deg, #0b0f1a, #05070d)",
        fontFamily: "'Rajdhani', sans-serif"
      }}
    >
      {/* SIDEBAR */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #0d1220, #05070d)",
          color: "#9ecbff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRight: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        {/* ☰ BUTON */}
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{ color: "#9ecbff", mt: 1 }}
        >
          <MenuIcon />
        </IconButton>

        {/* LOGO */}
        {open && (
          <Box sx={{ my: 1 }}>
            <img src={logo} alt="logo" style={{ width: 42 }} />
          </Box>
        )}

        {/* MENÜ */}
        <List dense sx={{ width: "100%", mt: 2 }}>
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              justifyContent: "center",
              color: "#9ecbff",
              "&:hover": { background: "rgba(100,150,255,0.15)" }
            }}
          >
            <DashboardIcon />
            {open && (
              <ListItemText
                primary="Öncelik"
                sx={{ ml: 1 }}
                primaryTypographyProps={{ fontSize: 14 }}
              />
            )}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/all"
            sx={{
              justifyContent: "center",
              color: "#9ecbff",
              "&:hover": { background: "rgba(100,150,255,0.15)" }
            }}
          >
            <ViewListIcon />
            {open && (
              <ListItemText
                primary="Genel"
                sx={{ ml: 1 }}
                primaryTypographyProps={{ fontSize: 14 }}
              />
            )}
          </ListItemButton>
        </List>
      </Box>

      {/* CARD ALANI */}
      <Box
        sx={{
          height: "80%",
          width: "60%",
          overflow: "hidden",
          background: "radial-gradient(circle at top, #10182a, #05070d)"
        }}
      >
        {children}
      </Box>

      {/* KAMERA ALANI */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#02040a",
          borderLeft: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            background: "linear-gradient(145deg,#0d1426,#05070d)",
            borderRadius: 2,
            border: "1px solid rgba(100,150,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6fa8ff",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: 2
          }}
        >
          CAMERA
        </Box>
      </Box>

      {/* CONTROL PANEL */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          pb: 2,
          background: "linear-gradient(180deg,#060a14,#02040a)",
          borderLeft: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <ControlPanel />
      </Box>
    </Box>
  );
}