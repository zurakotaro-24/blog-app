import Header from "../../components/header/header";
import styles from "./blogForm.module.css";
import logo from "../../logo.svg";
import { useState } from "react";
import { toast } from "react-toastify";
import { addBlog, type Blog } from "../../features/blogs/blogSlice";
import { useDispatch } from "react-redux";
import { useUploadBlogMutation, type BlogUpload } from "../../features/api/apiSlice";

interface NewBlogFormFields extends HTMLFormControlsCollection {
    title: HTMLInputElement, 
    description: HTMLInputElement, 
    image: HTMLInputElement,
}

interface NewBlogFormElements extends HTMLFormElement {
    readonly elements: NewBlogFormFields;
}

export default function BlogForm() {
    const user = JSON.parse(localStorage.getItem("user") || ("{}"));
    const [image, setImage] = useState<File>();
    const dispatch = useDispatch();
    const [uploadBlog, { error }] = useUploadBlogMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImage(file);
    }

    const submitBlog = async(e: React.SubmitEvent<NewBlogFormElements>) => {
        e.preventDefault();

        const { elements } = e.currentTarget;
        const title = elements.title.value;
        const description = elements.description.value;
        const authorId = user.id;

        const newUpload: BlogUpload = {
            title, 
            description, 
            image, 
            authorId, 
        }

        try {
            const addedBlog = await uploadBlog(newUpload).unwrap();
            toast.success("Blog uploaded successfully");
            dispatch(addBlog(addedBlog));
        }
        catch(err) {
            console.error(err, error);
        }
    }

    return(
        <div className="page">
            <Header />
            <div className="content">
                <h2 className={styles.header}>Add a blog</h2>
                <form className={styles.blogForm} onSubmit={submitBlog}>
                    <div className={styles.leftForm}>
                        <img 
                            src={image ? URL.createObjectURL(image) : logo}
                            style={{
                                visibility: image ? "visible" : "hidden", 
                                display: image ? "block" : "none",
                            }}
                        />
                        {!image && (
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
                            required
                        />
                    </div>
                    <div className={styles.rightForm}>
                        <div className={styles.blogTitle}>
                            <p>Title: </p>
                            <textarea 
                                name="title" 
                                id="title"
                                rows={2} 
                                required 
                            />
                        </div>
                        <div className={styles.blogDescription}>
                            <p>Description: </p>
                            <textarea 
                                name="description" 
                                id="description"
                                rows={18} 
                                required
                            />
                        </div>
                        <div className={styles.addBlogButton}>
                            <button type="submit">Add Blog</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}