import { NavigateFunction } from '@tanstack/react-router';
import { store } from '../store/store';

export const authMiddleware = (navigate: NavigateFunction) => {
  const state = store.getState();
  const isAuthenticated = state.auth.isAuthenticated;
  
  if (!isAuthenticated) {
    navigate({ to: '/sign-in' });
    return false;
  }
  
  return true;
}; 