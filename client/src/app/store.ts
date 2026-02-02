import { configureStore } from "@reduxjs/toolkit"; 
import authReducer from "../features/auth/authSlice";
import blogReducer from "../features/blogs/blogSlice";
import commentReducer from "../features/comments/commentSlice";
import { apiSlice } from "../features/api/apiSlice";

export const store = configureStore({
    reducer: { 
        auth: authReducer, 
        blogs: blogReducer,
        comments: commentReducer, 
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(apiSlice.middleware);
    }
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
