import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { useLoginAccountMutation } from "../../features/api/apiSlice";
import { type UserLogin, type LoginToken } from "../../features/api/apiSlice";
import { useDispatch } from "react-redux";
import { authorizeUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

interface LoginFormFields extends HTMLFormControlsCollection {
    email: HTMLInputElement, 
    password: HTMLInputElement,
}

interface LoginFormElements extends HTMLFormElement {
    readonly elements: LoginFormFields;
}

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginAccount, { error }] = useLoginAccountMutation();

    const loginUser = async(e: React.SubmitEvent<LoginFormElements>) => {
        e.preventDefault();

        const { elements } = e.currentTarget;
        const email = elements.email.value;
        const password = elements.password.value;

        const loginCredentials: UserLogin = {
            email, 
            password
        }

        try {
            const result = await loginAccount(loginCredentials).unwrap();
            toast.success("Logged in successfully");
            dispatch(authorizeUser({ accessToken: result.accessToken }));
        }
        catch(err) {
            toast.warning("User credentials are not correct.");
            console.error(err, error);
        }
    }

    const navigateToSignup = () => {
        navigate("/signup");
    }

    return (
        <div className={styles.container}>
            <h2>Welcome to Blog Website</h2>
            <h3>Login your Account</h3>
            <form className={styles.loginForm} onSubmit={loginUser}>
                <div className={styles.formInput}>
                    <p>Email</p>
                    <span> : </span>
                    <input type="email" name="email" id="email" required />
                </div>
                <div className={styles.formInput}>
                    <p>Password</p>
                    <span> : </span>
                    <input type="password" name="password" id="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
            <div className={styles.signupText}>
                <p>Don't have an account?</p>
                <p className={styles.signupLink} onClick={navigateToSignup}>Sign Up</p>
            </div>
        </div>
    );
}