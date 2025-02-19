import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const NotFoundPage = () => {

  const [availableHeight, setAvailableHeight] = useState("100vh");

  useEffect(() => {
    const updateHeight = () => {
      const headerHeight = document.getElementById("appbar")?.offsetHeight || 0;
      const footerHeight = document.getElementById("footer")?.offsetHeight || 0;
      setAvailableHeight(`calc(100vh - ${headerHeight + footerHeight}px)`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: availableHeight,
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h2" color="error" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" sx={{ mt: 1 }}>
        Page Not Found
      </Typography>
    </Box>
  )
}

export default NotFoundPage