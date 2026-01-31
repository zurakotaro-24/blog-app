import Header from "../../components/header/header"
import styles from "./viewBlog.module.css";
import logo from "../../logo.svg";
import { useParams } from "react-router-dom";
import { useGetBlogQuery } from "../../features/api/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useState, useEffect } from "react";
import { supabase } from "../../app/supabaseClient";
import { BlogImage } from "../home/home";

export default function ViewBlog() {
    const { id } = useParams();
    const BUCKETNAME = import.meta.env.VITE_SUPABASE_BUCKETNAME;
    const [image, setImage] = useState<BlogImage | null>();
    const { data, error, isLoading } = useGetBlogQuery(id ? id : skipToken);

    useEffect(() => {
        if(data) {
            console.log(data.image);
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKETNAME)
                .getPublicUrl(data.image);
            setImage({
                id: data.id, 
                image: publicUrl,
            });
        }
    }, [data]);

    return(
        <div className="page">
            <Header />
            <div className="content">
                <div className={styles.blogContainer}>
                    <div className={styles.leftContainer}>
                        <img src={logo}/>
                    </div>
                    <div className={styles.rightContainer}>
                        <p>Title {id}</p>
                        <p>Author</p>
                        <p>Publication Date</p>
                        <p>Description</p>
                    </div>
                </div>
            </div>
        </div>
    );
}