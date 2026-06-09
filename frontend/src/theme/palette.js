/**
 * Premium Theme Color Palette Configurations
 */
export const getPalette = (mode) => ({
  mode,
  primary: {
    main: mode === 'light' ? '#4f46e5' : '#818cf8', // Indigo
    light: '#6366f1',
    dark: '#3730a3'
  },
  secondary: {
    main: mode === 'light' ? '#ec4899' : '#f472b6', // Pink
    light: '#f472b6',
    dark: '#be185d'
  },
  background: {
    default: mode === 'light' ? '#f8fafc' : '#0f172a', // slate-50 vs slate-900
    paper: mode === 'light' ? '#ffffff' : '#1e293b'    // white vs slate-800
  },
  text: {
    primary: mode === 'light' ? '#0f172a' : '#f8fafc',
    secondary: mode === 'light' ? '#475569' : '#94a3b8'
  },
  success: {
    main: '#10b981', // Emerald
    contrastText: '#ffffff'
  },
  warning: {
    main: '#f59e0b' // Amber
  },
  error: {
    main: '#ef4444' // Red
  },
  info: {
    main: '#06b6d4' // Cyan
  }
});
