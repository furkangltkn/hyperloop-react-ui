import { Link } from "react-router-dom";
import { Box, List, ListItemButton, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
          ? "80px 1fr 260px 220px"
          : "40px 1fr 260px 220px",
        height: "100vh",
        overflow: "hidden",
        transition: "grid-template-columns 0.3s ease"
      }}
    >
      {/* SIDEBAR */}
      <Box
        sx={{
          background: "#111",
          color: "white",
          p: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* ☰ BUTON */}
        <IconButton onClick={() => setOpen(!open)} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>

        {/* LOGO */}
        {open && (
          <Box sx={{ my: 1 }}>
            <img src={logo} alt="logo" style={{ width: 40 }} />
          </Box>
        )}

        {/* MENÜ */}
        <List dense sx={{ width: "100%" }}>
          <ListItemButton component={Link} to="/" sx={{ justifyContent: "center" }}>
            {open && <ListItemText primary="Öncelik" />}
          </ListItemButton>

          <ListItemButton component={Link} to="/all" sx={{ justifyContent: "center" }}>
            {open && <ListItemText primary="Genel" />}
          </ListItemButton>
        </List>
      </Box>

      {/* CARD ALANI */}
      <Box sx={{ height: "100%", overflow: "hidden" }}>
        {children}
      </Box>

      {/* KAMERA ALANI */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000"
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            background: "#222",
            borderRadius: 2,
            border: "1px solid #444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777"
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
          pb: 2
        }}
      >
        <ControlPanel />
      </Box>
    </Box>
  );
}