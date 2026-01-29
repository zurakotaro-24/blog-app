import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = `${import.meta.env.VITE_API_URL}/users`

export interface Account {
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string,
}

export interface UserLogin {
    email: string, 
    password: string, 
}

export interface LoginToken {
    accessToken: string,
}

export const apiSlice = createApi({
    reducerPath: "api", 
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),
    endpoints(builder) {
        return {
            createAccount: builder.mutation<void, Account>({
                query: acc => ({
                    url: `/create-acc`, 
                    method: "POST",
                    body: acc 
                }),
            }), 
            loginAccount: builder.mutation<LoginToken, UserLogin>({
                query: acc => ({
                    url: `/login-acc`, 
                    method: "POST", 
                    body: acc,
                }),
            }),
        }
    }
});

export const { useCreateAccountMutation, useLoginAccountMutation } = apiSlice;