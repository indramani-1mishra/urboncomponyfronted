import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const validateForm = () => {
        if (!email) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Email is required!' });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address.' });
            return false;
        }
        if (!password) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Password is required!' });
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            await login(email, password);
            Swal.fire({
                icon: 'success',
                title: 'Welcome back!',
                text: 'You have successfully logged in.',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || 'Invalid credentials. Please try again.',
            });
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh] bg-slate-50">
            <form onSubmit={handleLogin} className="bg-white p-8 shadow-xl rounded-2xl w-96 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to your account</p>
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your password" />
                </div>
                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">Login</button>
            </form>
        </div>
    );
};

export default Login;
