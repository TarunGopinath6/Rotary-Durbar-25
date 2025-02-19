import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box 
      component="footer"
      sx={{
        backgroundColor: "black",
        color: "white",
        textAlign: "center",
        py: 2,
        //position: "fixed",
        //bottom: 0,
        width: "100%"
      }}
      id="footer"
    >
      <Typography variant="body2">
        © Royal Durbar {new Date().getFullYear()} All Rights Reserved |  
        <Link href="/privacy-policy" color="inherit" sx={{ mx: 1, textDecoration: "none" }}>
          Privacy Policy
        </Link> |  
        <Link href="/terms-of-service" color="inherit" sx={{ mx: 1, textDecoration: "none" }}>
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
}
