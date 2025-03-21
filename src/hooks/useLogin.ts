import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, setAuthError, setAuthLoading } from '../redux/store/authSlice';
import { signIn } from '../firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const useLogin = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsPending(true);
    setError(null);

    try {
      dispatch(setAuthLoading());
      const userCredential = await signIn({ email, password });

      if (userCredential) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', userCredential.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        if (userData) {
          const userWithRole = {
            ...userCredential,
            displayName: userData.displayName,
            role: userData.role || 'user'  // Default to 'user' if no role is found
          };

          dispatch(loginSuccess(userWithRole));  
          return { success: true };
        } else {
          throw new Error('Käyttäjän tietoja ei löydy Firestoresta');
        }
      } else {
        throw new Error('Sisäänkirjautuminen ei onnistunut. Tarkista sähköpostiosoite ja salasana.');
      }
    } catch (error: any) {
      dispatch(setAuthError(error.message));
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsPending(false);
    }
  };

  return { login, error, isPending };
};
