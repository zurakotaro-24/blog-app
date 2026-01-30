import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    id: number | null, 
    email: string, 
    name: string,
    exp?: number, 
    iat?: number,
}

interface AuthAccount {
    accessToken: string | null; 
    user: JwtPayload;
}

const initialState: AuthAccount = { 
    accessToken: null, 
    user: {
        id: null, 
        email: "", 
        name: "",
    }
};

const authSlice = createSlice({
    name: "auth", 
    initialState, 
    reducers: { 
        authorizeUser(state, action: PayloadAction<{ accessToken: string }>) {
            state.accessToken = action.payload.accessToken;
            localStorage.setItem("accessToken", state.accessToken);
            const decoded = jwtDecode<JwtPayload>(state.accessToken);
            state.user = decoded;
            localStorage.setItem("user", JSON.stringify(decoded));
        },
        logout(state) {
            state.accessToken = null;
            localStorage.removeItem("accessToken");
            state.user = {
                id: null, 
                email: "", 
                name: ""
            }
            localStorage.removeItem("user");
        }
    }
});

export const { authorizeUser, logout } = authSlice.actions;

export default authSlice.reducer;


