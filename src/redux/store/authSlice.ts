import { User } from '../../firebase/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: User | null;
    role: string;
    isAuthenticated: boolean;
    error: string | null;
    authStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Check for existing auth state in localStorage
const savedAuth = typeof window !== 'undefined' ? localStorage.getItem('auth') : null;
const parsedAuth = savedAuth ? JSON.parse(savedAuth) : null;

const initialState: AuthState = parsedAuth || {
    user: null,
    role: 'guest',
    isAuthenticated: false,
    error: null,
    authStatus: 'idle',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<User & { role: string }>) {
            state.user = action.payload;
            state.user.displayName = action.payload.displayName;
            state.role = action.payload.role || 'user';
            state.isAuthenticated = true;
            state.authStatus = 'succeeded';
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth', JSON.stringify(state));
            }
        },
        signupSuccess(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.user.displayName = action.payload.displayName;
            state.role = 'user';
            state.isAuthenticated = true;
            state.authStatus = 'succeeded';
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth', JSON.stringify(state));
            }
        },
        logoutSuccess(state) {
            state.user = null;
            state.role = 'guest';
            state.isAuthenticated = false;
            state.authStatus = 'idle';
            // Clear localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth');
            }
        },
        setAuthError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.authStatus = 'failed';
        },
        setAuthLoading(state) {
            state.authStatus = 'loading';
        },
        setUser(state, action: PayloadAction<User & { role: string }>) {
            state.user = action.payload;
            state.role = action.payload.role || 'user';
            state.isAuthenticated = true;
            state.authStatus = 'succeeded';
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth', JSON.stringify(state));
            }
        },
    }
});

export const { loginSuccess, logoutSuccess, setAuthError, setAuthLoading, signupSuccess, setUser } = authSlice.actions;
export default authSlice.reducer;

