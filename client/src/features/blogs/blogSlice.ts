import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Blog {
    id: number | null, 
    title: string, 
    description: string, 
    image: string, 
    publicationDate: Date | null, 
    authorId: number | null, 
    authorName: string,
}

const initialState: Blog[] = [
    { 
        id: null, 
        title: "", 
        description: "", 
        image: "", 
        publicationDate: null, 
        authorId: null, 
        authorName: "" 
    },
]

const blogSlice = createSlice({
    name: "blogs", 
    initialState, 
    reducers: {
        addBlog(state, action: PayloadAction<Blog>) {
            state.push(action.payload);
        }, 
    }
});

export const { addBlog } = blogSlice.actions;

export default blogSlice.reducer;