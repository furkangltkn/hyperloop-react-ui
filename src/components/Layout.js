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
import ConnectionStatus from "./ConnectionStatus";
import StatusBar from "./StatusBar";

import logo from "../assets/logo.jpeg";
import { useState } from "react";

export default function Layout({ children }) {

  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: open
          ? "90px 1fr 340px 240px"
          : "55px 1fr 340px 240px",

        gridTemplateRows: "34px 1fr",
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(180deg,#0b0f1a,#05070d)",
        transition: "grid-template-columns 0.3s ease",
        fontFamily: "'Rajdhani', sans-serif"
      }}
    >

    <Box sx={{ gridColumn: "1 / -1" }}>
      <StatusBar />
    </Box>

      {/* SIDEBAR */}

      <Box
        sx={{
          background: "linear-gradient(180deg,#0d1220,#05070d)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#9ecbff"
        }}
      >

        <IconButton
          onClick={() => setOpen(!open)}
          sx={{ color: "#9ecbff", mt: 1 }}
        >
          <MenuIcon />
        </IconButton>

        {open && (
          <Box sx={{ my: 1 }}>
            <img src={logo} alt="logo" style={{ width: 42 }} />
          </Box>
        )}

        <List dense sx={{ width: "100%", mt: 2 }}>

          <ListItemButton
            component={Link}
            to="/"
            sx={{
              justifyContent: "center",
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

        <Box sx={{ flexGrow: 1 }} />

        <ConnectionStatus />

      </Box>

      {/* CARD AREA */}

      <Box
        sx={{
          padding: 2,
          overflow: "hidden",
          background: "radial-gradient(circle at top,#10182a,#05070d)"
        }}
      >
        {children}
      </Box>

      {/* CAMERA */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          background: "#02040a"
        }}
      >

        <Box
          sx={{
            width: 320,
            height: 320,
            background: "linear-gradient(145deg,#0d1426,#05070d)",
            borderRadius: 3,
            border: "1px solid rgba(100,150,255,0.25)",
            boxShadow: "0 0 20px rgba(0,150,255,0.15)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6fa8ff",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: 2
          }}
        >

          <Typography
            sx={{
              position: "absolute",
              top: 8,
              left: 10,
              fontSize: 11,
              color: "red"
            }}
          >
            ● LIVE
          </Typography>

          CAMERA

          <Typography
            sx={{
              position: "absolute",
              bottom: 8,
              right: 10,
              fontSize: 11,
              color: "#7dd3fc"
            }}
          >
            30 FPS
          </Typography>

        </Box>

      </Box>

      {/* CONTROL PANEL */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 3,
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          background: "linear-gradient(180deg,#060a14,#02040a)"
        }}
      >
        <ControlPanel />
      </Box>

    </Box>
  );
}