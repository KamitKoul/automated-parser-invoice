import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      lighter: '#dbeafe', // Added lighter shade
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      lighter: '#fee2e2', // Added lighter shade
      contrastText: '#ffffff',
    },
    ...(mode === 'light'
      ? {
          background: {
            default: '#f3f4f6',
            paper: '#ffffff',
          },
          text: {
            primary: '#1f2937',
            secondary: '#6b7280',
          },
        }
      : {
          background: {
            default: '#111827',
            paper: '#1f2937',
          },
          text: {
            primary: '#f9fafb',
            secondary: '#9ca3af',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 700, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        containedPrimary: {
          boxShadow: '0 4px 6px -1px rgb(37 99 235 / 0.2)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(37 99 235 / 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: mode === 'light' ? '#f9fafb' : '#374151',
          color: mode === 'light' ? '#374151' : '#f9fafb',
        },
      },
    },
  },
});

const theme = createTheme(getDesignTokens('light'));

export default theme;