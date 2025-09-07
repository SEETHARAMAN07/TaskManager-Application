import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // try {
        //     const userData = await UserService.login(email, password);
        //     console.log(userData);

        //     if (userData.status !== 'APPROVED') {
        //         setError("Your account is not yet approved by the admin.");
        //         return;
        //     }
            
        //     if (userData.token) {
        //         localStorage.setItem('token', userData.token);

        //         if (userData.role === 'USER') {
        //             navigate('/employee');
        //         } else if (userData.role === 'ADMIN') {
        //             navigate('/admin');
        //         } else {
        //             navigate('/profile');
        //         }
        //     } else {
        //         setError(userData.message || "Login failed");
        //     }

        // } 
        // catch (error) {
        //     console.log(error);
        //     setError(error.message || "Login error occurred");
        //     setTimeout(() => {
        //         setError('');
        //     }, 5000);
        // }

        try {
    const userData = await UserService.login(email, password);
    console.log(userData);

    // First: check if token is missing and there's an error message
    if (!userData.token) {
        if (userData.message === "Bad credentials") {
            setError("Incorrect email or password.");
        } else {
            setError(userData.message || "Login failed.");
        }
        return; // stop further processing
    }

    // Now check approval
    if (userData.status !== 'APPROVED') {
        setError("Your account is not yet approved by the admin.");
        return;
    }

    // Successful login
    localStorage.setItem('token', userData.token);

    if (userData.role === 'USER') {
        navigate('/employee');
    } else if (userData.role === 'ADMIN') {
        navigate('/admin');
    } else {
        navigate('/profile');
    }

} catch (error) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
    } else {
        setError("Login error occurred.");
    }

    setTimeout(() => {
        setError('');
    }, 5000);
}

    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <button onClick={() => navigate('/newregister')} style={{ marginTop: '10px' }}>
                Register
            </button>
        </div>
    );
}

export default LoginPage;
