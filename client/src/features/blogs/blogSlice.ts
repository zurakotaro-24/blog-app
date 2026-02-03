import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdatedBlogResult } from "../api/apiSlice";

export interface Blog {
    id: number, 
    title: string, 
    description: string, 
    image: string, 
    publicationDate: Date | null, 
    authorId: number | null, 
    authorName: string,
}

const initialState: Blog[] = [];

const blogSlice = createSlice({
    name: "blogs", 
    initialState, 
    reducers: {
        addBlog(state, action: PayloadAction<Blog>) {
            return [...state, action.payload];
        }, 
        setBlogs(state, action: PayloadAction<Blog[]>) {
            return [...state, ...action.payload].sort((a, b) => a.id - b.id);
        }, 
        updateBlogState(state, action: PayloadAction<UpdatedBlogResult>) {
            const index = state.findIndex(blog => blog.id === action.payload.id);
            if(index >= 0) {
                state[index] = { 
                    ...state[index],  
                    title: action.payload.title, 
                    description: action.payload.description, 
                    image: action.payload.image, 
                };
            }
        }, 
    }
});

export const { addBlog, setBlogs, updateBlogState } = blogSlice.actions;

export default blogSlice.reducer;