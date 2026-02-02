import { useEffect, useState } from "react";
import Header from "../../components/header/header"
import styles from "./home.module.css";
import { useGetBlogsQuery } from "../../features/api/apiSlice";
import { supabase } from "../../app/supabaseClient";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBlogs } from "../../features/blogs/blogSlice";
import { RootState } from "../../app/store";

export interface BlogImage {
    id: number | null; 
    image: string;
}

export default function Home() {
    const BUCKETNAME = import.meta.env.VITE_SUPABASE_BUCKETNAME;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const storedBlogs = useSelector((state: RootState) => state.blogs);
    const { data: blogs, error, isLoading } = useGetBlogsQuery(null);
    const [images, setImages] = useState<BlogImage[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    useEffect(() => {
        if(blogs) {
            dispatch(setBlogs(blogs));
        }
    }, [blogs]); 

    useEffect(() => {
        if(storedBlogs) {
            const urls = storedBlogs.map((blog) => {
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
    }, [storedBlogs]);

    const offset = currentPage * itemsPerPage;
    const currentBlogs = storedBlogs?.slice(offset, offset + itemsPerPage)
    const pageCount = Math.ceil((storedBlogs?.length || 0) / itemsPerPage);

    const handlePageClick = (e: { selected: number }) => {
        setCurrentPage(e.selected);
    }

    const viewSpecificBlog = (id: number | null) => {
        navigate(`/blogs/${id}`);
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
        </div>
    );
}