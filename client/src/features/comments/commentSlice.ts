import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Comment {
    id: number, 
    image: string | null, 
    commentText: string, 
    commentDate: Date | null, 
    commentorId: number, 
    blogId: number, 
    commentorName: string,
}

const initialState: Comment[] = [];

const commentSlice = createSlice({
    name: "comments", 
    initialState, 
    reducers: {
        addComment(state, action: PayloadAction<Comment>) {
            state.push(action.payload);
        }, 
        setComments(state, action: PayloadAction<Comment[]>) {
            return action.payload;
        },
    }
});

export const { addComment, setComments } = commentSlice.actions;

export default commentSlice.reducer;