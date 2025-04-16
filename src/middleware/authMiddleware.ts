// import { NavigateFunction } from '@tanstack/react-router';
import { store } from '../store/store';
import { useNavigate } from '@tanstack/react-router';
export const authMiddleware = () => {
  const navigate = useNavigate()
  const state = store.getState();
  const isAuthenticated = state.auth.isAuthenticated;
  
  if (!isAuthenticated) {
    navigate({ to: '/sign-in' });
    return false;
  }
  
  return true;
}; 