// Create a new file: src/theme/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#A32638",
      light: "#B84B5C",
      dark: "#8C1F2F",
    },
    secondary: {
      main: "#FFBD1B",
      light: "#FFCA4D",
      dark: "#E5A700",
    },
    accent: {
      main: "#17458F",
      light: "#2A5CAA",
      dark: "#123672",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

export default theme;
