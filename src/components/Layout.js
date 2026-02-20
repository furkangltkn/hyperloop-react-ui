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
          ? "90px 1fr 260px 260px"
          : "50px 1fr 260px 260px",
        height: "100vh",
        overflow: "hidden",
        transition: "grid-template-columns 0.3s ease",
        background: "linear-gradient(135deg,#0b1320,#0f1f2f,#08131f)"
      }}
    >
      {/* SIDEBAR */}
      <Box
        sx={{
          background: "linear-gradient(180deg,#0a1624,#020a14)",
          color: "#0ff",
          p: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRight: "1px solid #1e3a5f"
        }}
      >
        <IconButton onClick={() => setOpen(!open)} sx={{ color: "#0ff" }}>
          <MenuIcon />
        </IconButton>

        {open && (
          <Box sx={{ my: 1 }}>
            <img src={logo} alt="logo" style={{ width: 40 }} />
          </Box>
        )}

        <List dense sx={{ width: "100%" }}>
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              justifyContent: "center",
              color: "#9ef",
              "&:hover": { background: "#102840" }
            }}
          >
            {open && <ListItemText primary="ÖNCELİK" />}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/all"
            sx={{
              justifyContent: "center",
              color: "#9ef",
              "&:hover": { background: "#102840" }
            }}
          >
            {open && <ListItemText primary="GENEL" />}
          </ListItemButton>
        </List>
      </Box>

      {/* CARD ALANI */}
      <Box sx={{ height: "100%", overflow: "hidden", p: 1 }}>
        {children}
      </Box>

      {/* KAMERA */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at top,#0c1e30,#020b14)"
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            background: "#050d18",
            borderRadius: 2,
            border: "1px solid #1e3a5f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0ff",
            fontFamily: "monospace",
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
          pb: 2
        }}
      >
        <ControlPanel />
      </Box>
    </Box>
  );
}