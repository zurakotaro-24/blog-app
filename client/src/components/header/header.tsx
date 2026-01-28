import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";

export default function Header() {
    const loggedIn: boolean = false;
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/login");
    }

    return (
        <header className={styles.container}>
            <div className={styles.leftHeader}>
                <p>Blog Website</p>
            </div>
            <div className={styles.rightHeader}>
                {loggedIn ? (
                    <>
                        <p>Welcome, Name</p>
                        <button>Add A Blog</button>
                        <button>Log out</button>
                    </>
                ) : (
                    <>
                        <button onClick={navigateToLogin}>Log in</button>
                        <button>Sign up</button>
                    </>
                )}
            </div>
        </header>
    );
}