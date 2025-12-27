import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5'
    },
    secondary: {
      main: '#06b6d4'
    }
  },
  typography: {
    h2: { fontWeight: 600 }
  }
});

export default theme;
