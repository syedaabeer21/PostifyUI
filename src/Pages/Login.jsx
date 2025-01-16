import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const email = useRef();
    const password = useRef();
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const navigate = useNavigate();

    const loginUser = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/v1/login', {
                email: email.current.value,
                password: password.current.value
            });

            const { accessToken, user } = response.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('username', user.username);

            // ✅ Sync state across components
            window.dispatchEvent(new Event("storage"));

            showAlert("User logged in successfully!", "alert-success");
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            showAlert("Login error: " + (error.response?.data?.message || error.message), "alert-error");
        }
    };

    const showAlert = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => setAlertMessage(""), 3000);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black text-white">
            <div className="w-full max-w-md bg-gray-900 p-10 rounded-lg shadow-lg border border-blue-500 space-y-6">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

                {/* Alert Modal */}
                {alertMessage && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                        <div className={`p-6 bg-white rounded-lg shadow-lg w-80 ${alertType}`}>
                            <p className="text-lg font-semibold text-center">{alertMessage}</p>
                            <button 
                                onClick={() => setAlertMessage("")} 
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={loginUser} className="space-y-4">
                    <input 
                        type='email' 
                        placeholder='Enter your email' 
                        ref={email} 
                        className="input input-bordered w-full bg-gray-800 text-white border-blue-500"
                        required
                    />
                    <input 
                        type='password' 
                        placeholder='Enter password' 
                        ref={password} 
                        className="input input-bordered w-full bg-gray-800 text-white border-blue-500"
                        required
                    />
                    <button 
                        type='submit' 
                        className="btn w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
