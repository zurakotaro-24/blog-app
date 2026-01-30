import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Blog } from "../blogs/blogSlice";

const API_URL = `${import.meta.env.VITE_API_URL}`

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

export interface BlogUpload {
    title: string, 
    description: string, 
    image: File | undefined, 
    authorId: string,
}

export const apiSlice = createApi({
    reducerPath: "api", 
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),
    endpoints: builder => ({
        createAccount: builder.mutation<void, Account>({
            query: acc => ({
                url: `/users/create-acc`, 
                method: "POST",
                body: acc 
            }),
        }), 
        loginAccount: builder.mutation<LoginToken, UserLogin>({
            query: acc => ({
                url: `/users/login-acc`, 
                method: "POST", 
                body: acc,
            }),
        }),  
        uploadBlog: builder.mutation<Blog, BlogUpload>({
            query: blog => {
                const formData = new FormData();
                formData.append("title", blog.title);
                formData.append("description", blog.description);
                formData.append("authorId", blog.authorId);
                if(blog.image) {
                    formData.append("image", blog.image);
                }

                return {
                    url: `/blogs/upload`, 
                    method: "POST", 
                    body: formData,
                };
            }
        }),
        getBlogs: builder.query<Blog[], string | null>({
            query(id) {
                if(id) {
                    return {
                        url: `/blogs/list?id=${id}`, 
                        method: "GET", 
                    }
                }
                return {
                    url: `/blogs/list`, 
                    method: "GET",
                }
            }
        }),
    })
});

export const { 
    useCreateAccountMutation, 
    useLoginAccountMutation, 
    useUploadBlogMutation, 
    useGetBlogsQuery,
} = apiSlice;