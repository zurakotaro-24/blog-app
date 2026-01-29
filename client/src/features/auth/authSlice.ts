import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthAccount {
    accessToken: string | null;
}

const initialState: AuthAccount = { 
    accessToken: null,
};

const authSlice = createSlice({
    name: "auth", 
    initialState, 
    reducers: { 
        authorizeUser(state, action: PayloadAction<{ accessToken: string | null }>) {
            state.accessToken = action.payload.accessToken;
        },
        logout(state) {
            state.accessToken = null;
        }
    }
});

export const { authorizeUser, logout } = authSlice.actions;

export default authSlice.reducer;


