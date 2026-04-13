import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { sharedStyles } from "../constants/styles";

const Signup = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login: saveLogin } = useAuth();

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const result = await signup(formData);

        setIsLoading(false);

        if (!result || !result.success) {
            toast.error(result?.error || 'Login failed. Please try again.');
            return;
        };

        saveLogin(result.data.token, result.data.user);
        navigate('/dashboard');
    }

    saveLogin(result.data.token, result.data.user);
    navigate('dashboard');

    return (
        <div className={sharedStyles.authPage}>
            <div className={sharedStyles.authCard}>
                <h1 className={sharedStyles.authTitle}>Create your account</h1>

                <form className={sharedStyles.form} onSubmit={handleSubmit}>
                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Full Name</label>
                        <input
                            className={sharedStyles.input}
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        ></input>
                    </div>

                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Email</label>
                        <input
                            className={sharedStyles.input}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        ></input>
                    </div>

                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Password</label>
                        <input
                            className={sharedStyles.input}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        ></input>
                    </div>

                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Confirm password</label>
                        <input
                            className={sharedStyles.input}
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        ></input>
                    </div>

                    <button
                        className={sharedStyles.button}
                        type="submit"
                        disabled={isLoading}
                    >{isLoading ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>

                <p className={sharedStyles.footer}>
                    Already have an account?{' '}
                    <Link className={sharedStyles.link} to="/login">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
};

export default Signup;