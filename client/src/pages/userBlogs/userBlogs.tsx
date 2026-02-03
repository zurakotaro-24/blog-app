import { useEffect, useState } from "react";
import Header from "../../components/header/header"
import styles from "./userBlogs.module.css";
import { supabase } from "../../app/supabaseClient";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { BlogImage } from "../home/home";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useGetBlogsQuery } from "../../features/api/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { Blog, setBlogs } from "../../features/blogs/blogSlice";

export default function UserBlogs() {
    const user = JSON.parse(localStorage.getItem("user") || ("{}"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BUCKETNAME = import.meta.env.VITE_SUPABASE_BUCKETNAME;
    const userBlogs = useSelector((state: RootState) => state.blogs.filter(blog => blog.authorId === Number(user.id)), shallowEqual);
    const { data: getBlogs,  error } = useGetBlogsQuery(userBlogs.length > 0 ? skipToken : null);
    const [images, setImages] = useState<BlogImage[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    useEffect(() => {
        if(!user || !user.id) {
            navigate("/");
        }
    }, [user]);

    useEffect(() => {
        if(userBlogs) {
            const urls = userBlogs.map((blog) => {
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
    }, [userBlogs]);

    useEffect(() => {
        if(getBlogs) {
            dispatch(setBlogs(getBlogs));
        }
    }, [getBlogs])

    const offset = currentPage * itemsPerPage;
    const currentBlogs = userBlogs?.slice(offset, offset + itemsPerPage)
    const pageCount = Math.ceil((userBlogs?.length || 0) / itemsPerPage);

    const handlePageClick = (e: { selected: number }) => {
        setCurrentPage(e.selected);
    }

    const viewSpecificBlog = (id: number | null) => {
        navigate(`/user-blogs/${id}`);
    }

    return (
        <div className="page">
            <Header />
            <div className="content">
                {!currentBlogs ? (
                    <>
                        <p>Loading</p>
                    </>
                ) : (
                    <div>
                        <h2>Your Blogs</h2>
                        {userBlogs.length <= 0 ? (
                            <div>
                                <p>No blogs posted yet</p>
                            </div>
                        ) : (
                            <div className={styles.pageContainer}>
                                <div className={styles.blogContainer}>
                                    {currentBlogs.map((blog) => (
                                        <div className={styles.blogCard} key={blog.id} onClick={() => viewSpecificBlog(blog.id)}>
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
                )}
            </div>
        </div>
    );
}