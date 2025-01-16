import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const name = useRef();
    const email = useRef();
    const password = useRef();
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/v1/register', {
                username: name.current.value,
                email: email.current.value,
                password: password.current.value
            });
            setAlertMessage("User registered successfully!");
            setAlertType("alert-success");
            setTimeout(() => navigate('/login'), 2000); 
        } catch (error) {
            setAlertMessage("Registration error: " + (error.response?.data?.message || error.message));
            setAlertType("alert-error");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black text-white pt-20">
            {/* Card Section */}
            <div className="card w-96 bg-gray-900 border border-blue-600 shadow-2xl p-8 rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Register</h1>

                {/* Alert Message
                {alertMessage && (
                    <div className={`alert ${alertType} mb-4`}>
                        <span>{alertMessage}</span>
                    </div>
                )} */}

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

                {/* Form Section */}
                <form onSubmit={registerUser} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Enter your username" 
                        ref={name} 
                        className="input input-bordered w-full bg-gray-800 text-white border-blue-500"
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        ref={email} 
                        className="input input-bordered w-full bg-gray-800 text-white border-blue-500"
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        ref={password} 
                        className="input input-bordered w-full bg-gray-800 text-white border-blue-500"
                        required
                    />
                    <button 
                        type="submit" 
                        className="btn w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition duration-300"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register;
