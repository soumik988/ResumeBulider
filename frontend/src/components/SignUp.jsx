import React, { useContext, useState } from 'react';
import { authStyles as styles } from '../assets/dummystyle';
import { useNavigate } from 'react-router-dom';
import { Input } from './Input';
import { UserContext } from '../context/userContext';
import axiosInstance from '../utils/axiosInstance';
import { validateEmail } from '../utils/helper';
import { API_PATHS } from '../utils/apiPaths';

const SignUp = ({ setCurrentPage }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!fullName) return setError("Please enter full name");
        if (!validateEmail(email)) return setError("Please enter valid email");
        if (!password) return setError("Please enter password");

        setError("");

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                name: fullName,
                email,
                password,
            });

            const { token, user } = response.data; // check your backend response
            if (token) {
                updateUser({ user, token }); // ✅ update context immediately
                navigate("/dashboard");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong. Please try again");
        }
    };


    return (
        <div className={styles.signupContainer}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.signupTitle}>Create Account</h3>
                <p className={styles.signupTitle}>Join thousands of professionals today</p>
            </div>

            <form onSubmit={handleSignUp} className={styles.signupForm}>
                <Input
                    value={fullName}
                    onChange={({ target }) => setFullName(target.value)}
                    label="Full Name"
                    placeholder="John Doe"
                    type="text"
                />
                <Input
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    label="Email"
                    placeholder="email@example.com"
                    type="email"
                />
                <Input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    label="Password"
                    placeholder="Min 8 characters"
                    type="password"
                />

                {error && <div className={styles.errorMessage}>{error}</div>}

                <button className={styles.signupSubmit} type="submit">
                    Create Account
                </button>

                <p className={styles.switchText}>
                    Already have an account?{' '}
                    <button
                        type="button"
                        className={styles.signupSwitchButton}
                        onClick={() => setCurrentPage('login')}
                    >
                        Sign In
                    </button>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
