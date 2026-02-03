import Header from "../../components/header/header"
import styles from "./viewBlog.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { type CommentUpload, useGetBlogsQuery, useGetBlogQuery, useUploadCommentMutation, useGetAllCommentsQuery } from "../../features/api/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useState, useEffect } from "react";
import { supabase } from "../../app/supabaseClient";
import { BlogImage } from "../home/home";
import logo from "../../logo.svg";
import { toast } from "react-toastify";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { addComment, setComments } from "../../features/comments/commentSlice";
import { RootState } from "../../app/store";

export interface CommentImage {
    id: number | null; 
    image: string | null;
}

export default function ViewBlog() {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("user") || ("{}"));
    const BUCKETNAME = import.meta.env.VITE_SUPABASE_BUCKETNAME;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [image, setImage] = useState<BlogImage | null>();
    const [commentImage, setCommentImage] = useState<CommentImage[] | null>();
    const storedComments = useSelector((state: RootState) => state.comments);
    const storedBlog = useSelector((state: RootState) => state.blogs.find(blog => blog.id === Number(id)));
    const { data: getBlogs, error, isLoading } = useGetBlogsQuery(storedBlog ? skipToken : null);
    // const { data: blogInfo, error: blogError, isLoading: blogLoading } = useGetBlogQuery(id ? id : skipToken);
    const { data: blogComments, error: commentError, isLoading: commentLoading } = useGetAllCommentsQuery(id ? id : skipToken);
    const [uploadComment, { error: uploadError }] = useUploadCommentMutation();
    const [isNewCommentOpen, setIsNewCommentOpen] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<{ image: File | undefined, comment: string }>({
        image: undefined, 
        comment: ""
    });

    useEffect(() => {
        if(storedBlog) {
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKETNAME)
                .getPublicUrl(storedBlog.image);
            setImage({
                id: storedBlog.id, 
                image: publicUrl,
            });
        }
    }, [storedBlog]);

    useEffect(() => {
        if(blogComments) {
            dispatch(setComments(blogComments));
        }
    }, [blogComments]);

    useEffect(() => {
        if(storedComments) {
            const urls: CommentImage[] = [];
            storedComments.map((comment) => {
                if(comment.image) {
                    const { data } = supabase.storage
                        .from(BUCKETNAME)
                        .getPublicUrl(comment.image);
                    urls.push({
                        id: comment.id, 
                        image: data.publicUrl
                    });
                }
            });
            setCommentImage(urls);
        }

    }, [storedComments]);

    useEffect(() => {
        if(!id) {
            navigate("/");
        }
    }, [id]);

    const openNewComment = () => {
        if(!user || !user.id) {
            toast.warning("Please login first to comment");
            return;
        }
        setIsNewCommentOpen(true);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setNewComment(prev => ({
            ...prev, 
            image: file,
        }));
    }

    const submitAddComment = async() => {
        if(!newComment.comment) {
            toast.warning("Please insert a comment");
            return;
        }

        const newUpload: CommentUpload = {
            image: newComment?.image ? newComment.image : undefined, 
            commentText: newComment.comment, 
            commentorId: user.id, 
            blogId: storedBlog!.id.toString(),
        }

        try {
            const addedComment = await uploadComment(newUpload).unwrap();
            toast.success("Comment added successfully");
            dispatch(addComment(addedComment));
            setNewComment({
                image: undefined, 
                comment: "",
            });
            setIsNewCommentOpen(false);
        }
        catch(err) {
            console.error(err, uploadError);
        }
    };

    return(
        <div className="page">
            <Header />
            <div className="content">
                {isLoading || !storedBlog ? (
                    <>
                        <p>Loading</p>
                    </>
                ) : (
                    <div>
                        <div className={styles.blogContainer}>
                            <div className={styles.leftContainer}>
                                <img src={image ? image.image : undefined}/>
                            </div>
                            <div className={styles.centerLine}>
                                
                            </div>
                            <div className={styles.rightContainer}>
                                <p className={styles.blogTitle}>{storedBlog.title}</p>
                                <p>Published by: {storedBlog.authorName}</p>
                                <p>Published on: {storedBlog.publicationDate?.toString()}</p>
                                <p className={styles.blogDesc}>{storedBlog.description}</p>
                            </div>
                        </div>
                        <div className={styles.commentsContainer}>
                            <h5>Comments</h5>
                            {storedComments.length <= 0 ? (
                                <div>
                                    <p>No comments yet</p>
                                </div>
                            ) : (
                                <div>
                                    {storedComments.map((comment) => ( 
                                        <div className={styles.comment} key={comment.id}>
                                            <p className={styles.commentorName}>{comment.commentorName} - {comment.commentDate?.toString()}</p>
                                            <p className={styles.commentText}>{comment.commentText}</p>
                                            <img src={commentImage?.find(img => img.id === comment.id)?.image || undefined } />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!isNewCommentOpen ? (
                                <div className={styles.addComment}>
                                    <button onClick={openNewComment}>Add Comment</button>
                                </div>
                            ) : (
                                <div className={styles.addCommentNew}>
                                    <div className={styles.addCommentTop}>
                                        <p>Add Comment</p>
                                        <button onClick={() => setIsNewCommentOpen(false)}>Close</button>
                                    </div>
                                    <div className={styles.addCommentInput}>
                                        <div className={styles.imageArea}>
                                            <img 
                                                src={newComment?.image ? URL.createObjectURL(newComment?.image) : undefined}
                                                style={{
                                                    visibility: image ? "visible" : "hidden", 
                                                    display: image ? "block" : "none",
                                                }}
                                            />
                                            {!newComment?.image && (
                                                <div className={styles.imageAreaText}>
                                                    <h5>Upload Image</h5>
                                                    <p>Select Image Here</p>
                                                </div>
                                            )}
                                            <input 
                                                className={styles.fileInputOverlay}
                                                type="file" 
                                                onChange={(e) => handleFileChange(e)}
                                                accept="image/jpeg, image/png, image/webp"
                                                required
                                            />
                                        </div>
                                        <textarea 
                                            name="description" 
                                            id="description"
                                            onChange={(e) => setNewComment(prev => ({
                                                ...prev, 
                                                comment: e.target.value
                                            }))}
                                            rows={5} 
                                        />
                                    </div>
                                    <button onClick={submitAddComment}>Add Comment</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}