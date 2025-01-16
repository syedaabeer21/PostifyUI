import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            const storedUsername = localStorage.getItem('username');
            setIsLoggedIn(!!token);
            setUsername(storedUsername || '');
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.dispatchEvent(new Event("storage"));
        showAlert("You have successfully logged out!", "alert-success");
        setTimeout(() => navigate('/login'), 2000); // Delay navigation for the alert message
    };
    const showAlert = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => setAlertMessage(''), 3000); // Hide alert after 3 seconds
    };

    return (
        <div className="fixed top-0 w-full z-50 navbar bg-gradient-to-r from-blue-900 to-black text-white shadow-lg px-6 py-3">
            {/* Logo Section */}
            <div className="flex-1">
                <Link to="/">
                    <img src={logo} alt="Logo" className="w-36 cursor-pointer" />
                </Link>
            </div>

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

            {/* Navigation Links */}
            <div className="flex-none space-x-6">
                <Link to="/" className="hover:text-blue-400 transition duration-300 font-semibold">Home</Link>
                
                {!isLoggedIn ? (
                    <>
                        <Link to="/register" className="hover:text-blue-400 transition duration-300 font-semibold">Register</Link>
                        <Link to="/login" className="hover:text-blue-400 transition duration-300 font-semibold">Login</Link>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-1 font-bold text-blue-400 text-lg"><FaUser />{username}</div>
                        <button 
                            onClick={handleLogout} 
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
