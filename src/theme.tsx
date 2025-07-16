import { createTheme } from '@suid/material';

declare module '@suid/material/styles' {
  interface Palette {
    accent: {
      main: string;
    };
    neonCyan: {
      main: string;
    };
    neonPink: {
      main: string;
    };
    energyOrange: {
      main: string;
    };
  }

  interface PaletteOptions {
    accent?: {
      main: string;
    };
    neonCyan?: {
      main: string;
    };
    neonPink?: {
      main: string;
    };
    energyOrange?: {
      main: string;
    };
  }
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#673AB7',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9575CD',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#EDE7F6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A237E',
      secondary: '#7986CB',
    },
    accent: {
      main: '#FFD700',
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      textShadow: '0 0 5px #00FFFF',
    },
    h2: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            transform: 'scale(1.05)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #673AB7, #9575CD)',
        },
      },
    },
    MuiCard: {
        root: {
          backgroundColor: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(103, 58, 183, 0.2)',
        },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #1A237E, #673AB7)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          transition: 'text-shadow 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(149, 117, 205, 0.2)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#673AB7',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9575CD',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: 'rgba(29, 21, 42, 0)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B39DDB',
    },
    accent: {
      main: '#FFD700',
    },
    neonCyan: {
      main: '#00FFFF',
    },
    neonPink: {
      main: '#FF00FF',
    },
    energyOrange: {
      main: '#FFA500',
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      textShadow: '0 0 5px #00FFFF',
    },
    h2: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            transform: 'scale(1.05)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #673AB7, #00FFFF)',
        },
      },
    },
    MuiCard: {
        root: {
          backgroundColor: '#1E1E1E',
          backgroundImage: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(103, 58, 183, 0.3)',
          transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'scale(1.05)',
            },
        },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #0D1B2A, #1A237E)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          transition: 'text-shadow 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          border: '1px solid rgba(149, 117, 205, 0.3)',
        },
      },
    },
  },
});