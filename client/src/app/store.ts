import { configureStore } from "@reduxjs/toolkit"; 
import counterReducer from "../features/counter/counterSlice";
import { dogsApiSlice } from "../features/dogs/dogsSlice";
import authReducer from "../features/auth/authSlice";
import { apiSlice } from "../features/api/apiSlice";

export const store = configureStore({
    reducer: { 
        auth: authReducer,
        counter: counterReducer, 
        [dogsApiSlice.reducerPath]: dogsApiSlice.reducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(dogsApiSlice.middleware)
            .concat(apiSlice.middleware);
    }
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
