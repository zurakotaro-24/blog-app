import { useEffect, useState } from "react";
import Header from "../../components/header/header"
import styles from "./userBlogs.module.css";
import { useGetBlogsQuery } from "../../features/api/apiSlice";
import { supabase } from "../../app/supabaseClient";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { BlogImage } from "../home/home";

export default function UserBlogs() {
    const user = JSON.parse(localStorage.getItem("user") || ("{}"));
    const navigate = useNavigate();
    const BUCKETNAME = import.meta.env.VITE_SUPABASE_BUCKETNAME;
    const { data, error, isLoading } = useGetBlogsQuery(user.id ? user.id : skipToken);
    const [images, setImages] = useState<BlogImage[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    useEffect(() => {
        if(!user || !user.id) {
            navigate("/");
        }
    }, [user]);

    useEffect(() => {
        if(data) {
            const urls = data.map((blog) => {
                const { data } = supabase.storage
                    .from(BUCKETNAME)
                    .getPublicUrl(blog.image);

                return {
                    id: blog.id, 
                    image: data.publicUrl,
                    }   
            });
            setImages(urls);
        }
    }, [data]);

    const offset = currentPage * itemsPerPage;
    const currentBlogs = data?.slice(offset, offset + itemsPerPage)
    const pageCount = Math.ceil((data?.length || 0) / itemsPerPage);

    const handlePageClick = (e: { selected: number }) => {
        setCurrentPage(e.selected);
    }

    return (
        <div className="page">
            <Header />
            <div className="content">
                {isLoading || !currentBlogs ? (
                    <>
                        <p>Loading</p>
                    </>
                ) : (
                    <div className={styles.pageContainer}>
                        <h2>All Blogs</h2>
                        <div className={styles.blogContainer}>
                            {currentBlogs.map((blog) => (
                                <div className={styles.blogCard} key={blog.id}>
                                    <img className={styles.blogImage}
                                        src={images.find(img => img.id === blog.id)?.image || undefined} />
                                    <p>{blog.title}</p>
                                    <p>{blog.authorName}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.paginateContainer}>
                            <ReactPaginate 
                                breakLabel="..." 
                                nextLabel="next >" 
                                onPageChange={handlePageClick} 
                                pageRangeDisplayed={itemsPerPage} 
                                pageCount={pageCount} 
                                previousLabel="< prev" 
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}