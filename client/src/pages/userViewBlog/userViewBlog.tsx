import Header from "../../components/header/header"
import styles from "./userViewBlog.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteBlogMutation, useGetBlogQuery } from "../../features/api/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useState, useEffect } from "react";
import { supabase } from "../../app/supabaseClient";
import { BlogImage } from "../home/home";
import { toast } from "react-toastify";

export default function UserViewBlog() {
    const { id } = useParams();
    const BUCKETNAME = import.meta.env.VITE_SUPABASE_BUCKETNAME;
    const navigate = useNavigate();
    const [image, setImage] = useState<BlogImage | null>();
    const { data: blogInfo, error, isLoading } = useGetBlogQuery(id ? id : skipToken);
    const [ deleteBlog, { error: deleteError }] = useDeleteBlogMutation();

    useEffect(() => {
        if(blogInfo) {
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKETNAME)
                .getPublicUrl(blogInfo.image);
            setImage({
                id: blogInfo.id, 
                image: publicUrl,
            });
        }
    }, [blogInfo]);

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
                {isLoading || !blogInfo ? (
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
                            <p className={styles.blogTitle}>{blogInfo.title}</p>
                            <p>Published by: {blogInfo.authorName}</p>
                            <p>Published on: {blogInfo.publicationDate?.toString()}</p>
                            <p className={styles.blogDesc}>{blogInfo.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}