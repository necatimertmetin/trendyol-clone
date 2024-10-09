// theme.js
import { createTheme } from "@mui/material/styles";

// Theme customization for MUI
const theme = createTheme({
  palette: {
    brand: {
      light: "#FFECB3",  // Light golden yellow
      main: "#FFB74D",   // Dark golden yellow
      dark: "#D7CCC8",   // Beige
      contrastText: "#3E2723",  // Dark brown for text
    },
    primary: {
      main: "#3E2723",  // Dark brown (koyu kahve)
    },
    secondary: {
      main: "#4E342E",  // Brown (kahverengi)
    },
    background: {
      default: "#FFECB3",  // Light golden yellow as the default background
    },
  },
  typography: {
    fontWeightBold: 700,  // Set bold font weight for headings and buttons
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700,  // Bold for all buttons
        },
        contained: {
          backgroundColor: "#FFB74D",  // Golden yellow for contained buttons
          color: "white",
          "&:hover": {
            backgroundColor: "#D7CCC8",  // Beige on hover
          },
        },
        outlined: {
          borderColor: "#8D6E63",  // Light brown
          color: "#8D6E63",
          "&:hover": {
            borderColor: "#4E342E",  // Dark brown on hover
            color: "#4E342E",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontWeight: 700,  // Bold font weight for h1
        },
        h2: {
          fontWeight: 700,  // Bold font weight for h2
        },
        h3: {
          fontWeight: 700,  // Bold font weight for h3
        },
      },
    },
  },
});

export default theme;
