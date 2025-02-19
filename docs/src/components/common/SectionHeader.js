import React from 'react'
import { Box, Typography } from "@mui/material";

const SectionHeader = ({ title1, title2, subtitle}) => {
  return (
    <Box
    sx={{
      height: "35vh",
      width: "100%",
      background: "linear-gradient(to bottom right, #D8475C, #A32638 )",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }}
  >
    <Typography variant='h3' sx={{ color: "white", mb: 1 }}>
      {title1}
    </Typography>
    <Typography variant='h4' gutterBottom sx={{ color: "white", mb: 3 }}>
      {title2}
    </Typography>
    <Typography variant='h5' sx={{ color: "white" }}>
      {subtitle}
    </Typography>
  </Box>

  )
}

export default SectionHeader