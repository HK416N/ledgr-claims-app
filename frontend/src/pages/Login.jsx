import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { sharedStyles } from "../constants/styles";

const Login = () => {
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

        const result = await login(formData);

        setIsLoading(false);

        if (!result || !result.success) {
            toast.error(result?.error || 'Login failed. Please try again.');
            return;
        };

        saveLogin(result.data.token, result.data.user);
        navigate('/dashboard');
    };

    return (
        <div className={sharedStyles.authPage}>
            <div className={sharedStyles.authCard}>
                <h1 className={sharedStyles.authTitle}>Sign in to ledgr</h1>

                <form className={sharedStyles.form} onSubmit={handleSubmit}>
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
                    <button
                        className={sharedStyles.button}
                        type="submit"
                        disabled={isLoading}
                    >{isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className={sharedStyles.footer}>
                    Need an account?{' '}
                    <Link className={sharedStyles.link} to="/signup">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;