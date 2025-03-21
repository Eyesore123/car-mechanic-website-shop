import { useDispatch } from 'react-redux';
import { logoutSuccess, setAuthError, setAuthLoading } from '../redux/store/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      dispatch(setAuthLoading());
      await signOut(auth);
      dispatch(logoutSuccess());
    } catch (error: any) {
      dispatch(setAuthError(error.message));
    }
  };

  return { logout };
};
