import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import Modal from "../modal/modal";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

export default function Header() {
    const user = JSON.parse(localStorage.getItem("user") || ("{}"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const navigateToLogin = () => {
        navigate("/login");
    }

    const navigateToSignup = () => {
        navigate("/signup");
    }

    const logoutUser = () => {
        dispatch(logout());
        setIsModalOpen(false);
        toast.success("Logged out successfully");
        navigate("/");
    }

    const addBlog = () => {
        navigate("/add-blog");
    }

    return (
        <>
            <header className={styles.container}>
                <div className={styles.leftHeader}>
                    <p>Blog Website</p>
                </div>
                <div className={styles.rightHeader}>
                    {user.id ? (
                        <>
                            <p>Welcome, {user.name}</p>
                            <button onClick={addBlog}>Add A Blog</button>
                            <button onClick={() => setIsModalOpen(true)}>Log out</button>
                        </>
                    ) : (
                        <>
                            <button onClick={navigateToLogin}>Log in</button>
                            <button onClick={navigateToSignup}>Sign up</button>
                        </>
                    )}
                </div>
                
            </header>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={styles.modalContent}>
                    <p>Are you sure you want to log out?</p>
                    <div className={styles.buttonRow}>
                        <button className={styles.logoutBtn} onClick={logoutUser}>
                            Yes, Logout
                        </button>
                        <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
        
    );
}