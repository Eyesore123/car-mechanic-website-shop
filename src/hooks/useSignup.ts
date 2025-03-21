// hooks/useSignup.ts
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signUp } from '../firebase/auth';
import { signupSuccess, setAuthLoading, setAuthError, setUser } from '../redux/store/authSlice';
import { User } from '../firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';

// Experimental
import crypto from 'crypto';

export const useSignup = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
  };

    const signup = async (email: string, password: string, displayName: string): Promise<{ success: boolean; error?: string }> => {
      setIsPending(true);
      setError(null);
    try {
      dispatch(setAuthLoading());
    const user: User | null = await signUp({ email, password });

    if (user) {

      const auth = getAuth();
      await updateProfile(auth.currentUser!, {
        displayName: displayName,
      });

      const unsubscribeToken = generateToken();
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        email: user.email,
        displayName: displayName,
        role: 'user',
        subEmail: '',
        subscribed: false,
        unsubscribeToken: unsubscribeToken,
        createdAt: new Date().toString()
      });

      dispatch(signupSuccess(user));
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: 'user',
      }));
      setUserId(user.uid);
      return { success: true };
    } else {
      dispatch(setAuthError('Failed to sign up.'));
      setError('Failed to sign up.');
      return { success: false, error: 'Failed to sign up.' };
    }
  } catch (error: any) {
    dispatch(setAuthError(error.message));
    return { success: false, error: error.message };
  } finally {
    setIsPending(false);
  }
};

  return { signup, error, isPending };
};
