import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, Auth, UserCredential} from "firebase/auth";
import app from "./firebaseConfig";

export interface User {
    uid: string;
    role: string;
    email: string | null;
    displayName: string | null;
  }

interface AuthCredentials {
    email: string;
    password: string;
}

const auth: Auth = getAuth(app);

export const signUp = async ({ email, password }: AuthCredentials): Promise<User | null> => {
    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
        return {
            uid: userCredential.user.uid,
            role: 'user',
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
        };
    } catch (error) {
        console.error("Error signing up:", error);
        return null;
    }
};

export const signIn = async ({ email, password }: AuthCredentials): Promise<User | null> => {
    try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
            uid: userCredential.user.uid,
            role: 'user',
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
        };
    } catch (error) {
        console.error("Error signing in:", error);
        return null;
    }
};

export const logOut = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error logging out:", error);
    }
};