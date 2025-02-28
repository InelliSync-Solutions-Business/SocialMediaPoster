import { createTheme } from '@mui/material/styles';

// Define light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6', // Vibrant blue
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981', // Teal
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Very light blue-gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Dark blue-gray
      secondary: '#475569', // Medium blue-gray
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    error: {
      main: '#ef4444', // Red
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#0ea5e9', // Sky blue
      light: '#38bdf8',
      dark: '#0284c7',
    },
    success: {
      main: '#10b981', // Emerald
      light: '#34d399',
      dark: '#059669',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          boxShadow: '0 2px 4px 0 rgba(59, 130, 246, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            boxShadow: '0 4px 8px 0 rgba(59, 130, 246, 0.3)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
          boxShadow: '0 2px 4px 0 rgba(16, 185, 129, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669, #0284c7)',
            boxShadow: '0 4px 8px 0 rgba(16, 185, 129, 0.3)',
          },
        },
        outlined: {
          borderWidth: 2,
        },
        outlinedPrimary: {
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
          background: 'linear-gradient(120deg, #ffffff, #f8fafc)',
          '&:hover': {
            boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#3b82f6',
              borderWidth: '2px',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#3b82f6',
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          backgroundColor: '#e9e9ea',
        },
      },
    },
  },
});

// Define dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#f48fb1',
      light: '#ffc1e3',
      dark: '#bf5f82',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        containedPrimary: {
          boxShadow: '0 2px 4px 0 rgba(144, 202, 249, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px 0 rgba(144, 202, 249, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

export default {
  lightTheme,
  darkTheme,
};
