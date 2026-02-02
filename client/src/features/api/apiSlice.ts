import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Blog } from "../blogs/blogSlice";
import { type Comment } from "../comments/commentSlice";

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

export interface BlogUpdate extends BlogUpload {
    id: string, 
    imagePath: string,
}

export interface UpdatedBlogResult {
    id?: number, 
    title: string, 
    description: string, 
    image: string,
}

export interface CommentUpload {
    image: File | undefined, 
    commentText: string, 
    commentorId: string, 
    blogId: string,
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
                        url: `/blogs/list/${id}`, 
                        method: "GET", 
                    }
                }
                return {
                    url: `/blogs/list`, 
                    method: "GET",
                }
            }
        }),
        getBlog: builder.query<Blog, string>({
            query(id) {
                return {
                    url: `/blogs/${id}`, 
                    method: "GET",
                }
            }
        }),
        deleteBlog: builder.mutation<void, number>({
            query: blogId => ({
                url: `/blogs/${blogId}`, 
                method: "DELETE", 
            })
        }),
        updateBlog: builder.mutation<UpdatedBlogResult, BlogUpdate>({
            query: blog => {
                const formData = new FormData();
                formData.append("id", blog.id);
                formData.append("title", blog.title);
                formData.append("description", blog.description);
                formData.append("authorId", blog.authorId);
                formData.append("imagePath", blog.imagePath);
                if(blog.image) {
                    formData.append("image", blog.image);
                }

                return {
                    url: `/blogs/update`, 
                    method: "PATCH", 
                    body: formData,
                };
            }
        }), 
        uploadComment: builder.mutation<Comment, CommentUpload>({
            query: comment => {
                const formData = new FormData();
                formData.append("commentText", comment.commentText);
                formData.append("commentorId", comment.commentorId); 
                formData.append("blogId", comment.blogId);
                if(comment.image) {
                    formData.append("image", comment.image);
                }

                return {
                    url: `/comments/upload`, 
                    method: "POST", 
                    body: formData,
                };
            }
        }),
    })
});

export const { 
    useCreateAccountMutation, 
    useLoginAccountMutation, 
    useUploadBlogMutation, 
    useGetBlogsQuery, 
    useGetBlogQuery, 
    useDeleteBlogMutation, 
    useUpdateBlogMutation, 
    useUploadCommentMutation, 
} = apiSlice;