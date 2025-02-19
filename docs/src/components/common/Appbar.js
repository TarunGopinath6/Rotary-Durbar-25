import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Toolbar, Typography, Menu, Container, IconButton, Button, MenuItem, } from "@mui/material";

import Logo from "../../assets/images/durbar_badge.png";

const pages = [];
const linksToPage = {}

export default function ResponsiveAppBar() {
  // const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Fixed the error by handling the close case separately
  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    if (typeof page === "string" && linksToPage[page]) {
      const targetSection = document.getElementById(linksToPage[page]);
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  return (
    <AppBar
      position="sticky"
      color="primary"
      sx={{ background: "primary", boxShadow: 0 }}
      id="appbar"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              // justifyContent: "space-between",
            }}
          >
            {/* Desktop Logo */}
            <Box
              component="img"
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on mobile
                maxHeight: { md: 58 },
                height: "auto",
                objectFit: "cover",
                // width: { md: 170 },
                //paddingTop: 1.5,
                //paddingBottom: 1.5,
                mr: 3
              }}
              src={Logo}
            />
            {/* Desktop Menu */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{ my: 1, mx: 1, color: "#3b3b3b", display: "block" }}
                >
                  <Typography textAlign="center" fontSize={14} color="white">
                    {capitalizeFirstLetter(page)}
                  </Typography>
                </Button>

              ))}
            </Box>
          </Box>

          {/* Mobile Menu and Layout */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              // position: "relative",
              my: 1,
            }}
          >
            {pages.length > 0 && <Box
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
                my: 1,
              }}
            >
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>}

            {/* Centered Mobile Logo */}
            <Box
              component="img"
              sx={{
                // position: "absolute", // Absolute positioning to center it
                // left: "50%", // Start positioning from the center
                // transform: "translateX(-50%)", // Offset to fully center horizontally
                display: { xs: "flex", md: "none" }, // Hide on mobile
                maxHeight: { xs: 50 },
                height: "auto",
                // paddingTop: 0.5,
              }}
              src={Logo}
            />

            {/* Mobile Menu */}
            <Menu
              position="relative"
              marginThreshold={0}
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu()} // No parameter when just closing
              sx={{
                display: { xs: "block", md: "none" },
              }}
              slotProps={{
                paper: {
                  sx: {
                    width: "100%",
                    maxWidth: "100%",
                    left: "3px",
                    right: "3px",
                    my: 0.5,
                  },
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    my: 1,
                  }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}