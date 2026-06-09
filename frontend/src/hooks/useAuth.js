import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom Hook to access global authentication details
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be nested within an AuthProvider context wrapper.');
  }
  return context;
};
