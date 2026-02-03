import Header from "../../components/header/header"
import styles from "./userViewBlog.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteBlogMutation, useGetBlogQuery, useGetBlogsQuery } from "../../features/api/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useState, useEffect } from "react";
import { supabase } from "../../app/supabaseClient";
import { BlogImage } from "../home/home";
import { toast } from "react-toastify";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setBlogs } from "../../features/blogs/blogSlice";

export default function UserViewBlog() {
    const { id } = useParams();
    const BUCKETNAME = import.meta.env.VITE_SUPABASE_BUCKETNAME;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [image, setImage] = useState<BlogImage | null>();
    const storedBlog = useSelector((state: RootState) => state.blogs.find(blog => blog.id === Number(id)), shallowEqual);
    const { data: getBlogs, error, isLoading } = useGetBlogsQuery(storedBlog ? skipToken : null);
    // const { data: blogInfo, error, isLoading } = useGetBlogQuery(id ? id : skipToken);
    const [ deleteBlog, { error: deleteError }] = useDeleteBlogMutation();

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
        if(getBlogs) {
            dispatch(setBlogs(getBlogs));
        }
    }, [getBlogs]); 

    const navigateToEdit = (blogId: number | null) => {
        navigate(`/user-blogs/edit/${blogId}`);
    }

    const handleDeleteBlog = async(blogId: number | null) => {
        if(blogId) {
            try {
                await deleteBlog(blogId);
                toast.success("Blog Deleted");
                navigate("/");
            }
            catch(err) {
                console.log(err, deleteError);
            }
        }
    }

    return(
        <div className="page">
            <Header />
            <div className="content">
                {isLoading || !storedBlog ? (
                    <>
                        <p>Loading</p>
                    </>
                ) : (
                    <div className={styles.blogContainer}>
                        <div className={styles.leftContainer}>
                            <img src={image ? image.image : undefined}/>
                            {image?.id && (
                                <div className={styles.buttons}>
                                    <button onClick={() => navigateToEdit(image.id)}>Edit</button>
                                    <button onClick={() => handleDeleteBlog(image.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                        <div className={styles.centerLine}></div>
                        <div className={styles.rightContainer}>
                            <p className={styles.blogTitle}>{storedBlog.title}</p>
                            <p>Published by: {storedBlog.authorName}</p>
                            <p>Published on: {storedBlog.publicationDate?.toString()}</p>
                            <p className={styles.blogDesc}>{storedBlog.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}