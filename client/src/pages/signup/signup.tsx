import { useNavigate } from "react-router-dom";
import styles from "./signup.module.css";
import { toast } from "react-toastify";
import { type Account } from "../../features/api/apiSlice";
import { useCreateAccountMutation } from "../../features/api/apiSlice";

interface SignupFormFields extends HTMLFormControlsCollection {
    firstName: HTMLInputElement,
    lastName: HTMLInputElement,
    email: HTMLInputElement,
    password: HTMLInputElement,
    confirmPassword: HTMLInputElement,
}

interface SignupFormElements extends HTMLFormElement {
    readonly elements: SignupFormFields;
}

export default function Signup() {
    const navigate = useNavigate();
    const [createAccount, { error }] = useCreateAccountMutation();

    const navigateToLogin = () => {
        navigate("/login");
    }

    const signupUser = async(e: React.SubmitEvent<SignupFormElements>) => {
        e.preventDefault();

        const { elements } = e.currentTarget;
        if(elements.password.value != elements.confirmPassword.value) {
            toast.warning("Password and Confirm Password are not the same");
            
            return;
        }

        const firstName = elements.firstName.value;
        const lastName = elements.lastName.value;
        const email = elements.email.value;
        const password = elements.password.value;

        const newAccount: Account = {
            firstName,
            lastName,
            email,  
            password
        }
        
        try {
            await createAccount(newAccount);
            e.currentTarget.reset();
        }
        catch(err) {
            console.error(err, error);
        }

    }

    return(
        <div className={styles.container}>
            <h2>Welcome to Blog Website</h2>
            <h3>Create an Account</h3>
            <form className={styles.signupForm} onSubmit={signupUser}>
                <div className={styles.formInput}>
                    <p>First Name</p>
                    <span> : </span>
                    <input type="text" name="firstName" id="firstName" required />
                </div>
                <div className={styles.formInput}>
                    <p>Last Name</p>
                    <span> : </span>
                    <input type="text" name="lastName" id="lastName" required />
                </div>
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
                <div className={styles.formInput}>
                    <p>Confirm Password</p>
                    <span> : </span>
                    <input type="password" name="confirmPassword" id="confirmPassword" required />
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