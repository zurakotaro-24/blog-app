import { useNavigate } from "react-router-dom";
import styles from "./signup.module.css";

export default function Signup() {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/login");
    }

    const signupUser = () => {
        
    }

    return(
        <div className={styles.container}>
            <h2>Welcome to Blog Website</h2>
            <h3>Create an Account</h3>
            <form className={styles.signupForm} onSubmit={signupUser}>
                <div className={styles.formInput}>
                    <p>First Name</p>
                    <span> : </span>
                    <input type="text" name="firstName" />
                </div>
                <div className={styles.formInput}>
                    <p>Last Name</p>
                    <span> : </span>
                    <input type="text" name="lastName" />
                </div>
                <div className={styles.formInput}>
                    <p>Email</p>
                    <span> : </span>
                    <input type="email" name="email" />
                </div>
                <div className={styles.formInput}>
                    <p>Password</p>
                    <span> : </span>
                    <input type="password" name="password" />
                </div>
                <div className={styles.formInput}>
                    <p>Confirm Password</p>
                    <span> : </span>
                    <input type="password" name="confirmPassword" />
                </div>
                <button type="submit">Sign up</button>
            </form>
            <div className={styles.loginText}>
                <p>Already have an account?</p>
                <p className={styles.loginLink} onClick={navigateToLogin}>Login</p>
            </div>
        </div>
    );
}