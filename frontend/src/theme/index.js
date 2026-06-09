import { createTheme } from '@mui/material/styles';
import { getPalette } from './palette';
import typography from './typography';

/**
 * Compile customized Material UI Theme settings
 * @param {string} mode - 'light' | 'dark'
 */
export const createAppTheme = (mode) => {
  const palette = getPalette(mode);

  return createTheme({
    palette,
    typography,
    shape: {
      borderRadius: 12
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
            }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            backgroundImage: 'none',
            boxShadow: mode === 'light' 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            border: mode === 'light' 
              ? '1px solid #e2e8f0' 
              : '1px solid #334155'
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
            color: mode === 'light' ? '#0f172a' : '#f8fafc',
            backdropFilter: 'blur(12px)',
            borderBottom: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155',
            boxShadow: 'none'
          }
        }
      }
    }
  });
};
