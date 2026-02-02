import Header from "../../components/header/header";
import styles from "./userEditBlog.module.css";
import { useState, useEffect } from "react";
import { BlogUpdate, UpdatedBlogResult, useGetBlogQuery, useUpdateBlogMutation } from "../../features/api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { supabase } from "../../app/supabaseClient";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateBlogState } from "../../features/blogs/blogSlice";

export default function UserEditBlog() {
    const { id } = useParams();
    const BUCKETNAME = import.meta.env.VITE_SUPABASE_BUCKETNAME;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user") || ("{}"));
    const [image, setImage] = useState<File>();
    const [blog, setBlog] = useState<{ 
        title: string, description: string, image: string }>({
        title: "", description: "", image: ""
    });
    const { data: blogInfo, error, isLoading } = useGetBlogQuery(id ? id : skipToken);
    const [updateBlog, { error: updateError }] = useUpdateBlogMutation();

    useEffect(() => {
        if(blogInfo) {
            if(!(user.id == blogInfo.authorId)) {
                navigate("/");
            }
            else {
                const { data: { publicUrl } } = supabase.storage
                    .from(BUCKETNAME)
                    .getPublicUrl(blogInfo.image);
                setBlog(prev => ({
                    ...prev, 
                    title: blogInfo.title, 
                    description: blogInfo.description, 
                    image: publicUrl,
                }));
            }
        }
    }, [blogInfo]); 

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImage(file);
    }

    const submitBlog = async(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if(id && blogInfo?.authorId) {
                const updateBlogInfo: BlogUpdate = {
                    id: id, 
                    title: blog.title, 
                    description: blog?.description,
                    image: image, 
                    imagePath: blogInfo.image,
                    authorId: blogInfo.authorId.toString(), 
                }
                const result = await updateBlog(updateBlogInfo).unwrap();
                dispatch(updateBlogState(result));
                navigate("/");
                toast.success("Blog uploaded successfully");
            }
        }
        catch(err) {
            console.error(err, updateError);
        }
    }

    return(
        <div className="page">
            <Header />
            <div className="content">
                <h2 className={styles.header}>Update a blog</h2>
                <form className={styles.blogForm} onSubmit={submitBlog}>
                    <div className={styles.leftForm}>
                        <img 
                            src={image ? URL.createObjectURL(image) : blog?.image ? blog?.image : undefined}
                            style={{
                                visibility: image || blog?.image ? "visible" : "hidden", 
                                display: image || blog?.image? "block" : "none",
                            }}
                        />
                        {!image && !blog?.image &&(
                            <>
                                <h4>Upload Main Image</h4>
                                <p>Click here to select the image</p>
                            </>
                        )}
                        <input 
                            className={styles.fileInputOverlay}
                            type="file" 
                            onChange={(e) => handleFileChange(e)}
                            accept="iamge/jpeg, image/png, image/webp"
                        />
                    </div>
                    <div className={styles.rightForm}>
                        <div className={styles.blogTitle}>
                            <p>Title: </p>
                            <textarea 
                                name="title" 
                                id="title"
                                rows={2} 
                                value={blog?.title}
                                onChange={(e) => setBlog(prev => ({
                                    ...prev, 
                                    title: e.target.value
                                }))}
                                required 
                            />
                        </div>
                        <div className={styles.blogDescription}>
                            <p>Description: </p>
                            <textarea 
                                name="description" 
                                id="description"
                                rows={18} 
                                value={blog?.description}
                                onChange={(e) => setBlog(prev => ({
                                    ...prev, 
                                    description: e.target.value
                                }))}
                                required
                            />
                        </div>
                        <div className={styles.addBlogButton}>
                            <button type="submit">Update Blog</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}