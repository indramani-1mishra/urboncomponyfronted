import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const validateForm = () => {
        if (!name || name.trim().length < 3) {
            Swal.fire({ icon: 'warning', title: 'Invalid Name', text: 'Name should be at least 3 characters long.' });
            return false;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            Swal.fire({ icon: 'warning', title: 'Invalid Email', text: 'Please enter a valid email address.' });
            return false;
        }
        if (!password || password.length < 6) {
            Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 6 characters long.' });
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await register(name, email, password, role);
            Swal.fire({
                icon: 'success',
                title: 'Account Created',
                text: 'You have registered successfully!',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.message || 'Something went wrong.',
            });
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh] bg-slate-50">
            <form onSubmit={handleRegister} className="bg-white p-8 shadow-xl rounded-2xl w-96 space-y-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                </div>
                <div>
                    <label className="block text-gray-600 mb-1">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-gray-600 mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="johndoe@example.com" />
                </div>
                <div>
                    <label className="block text-gray-600 mb-1">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="At least 6 characters" />
                </div>
                <div>
                    <label className="block text-gray-600 mb-1">Role</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition mt-4">Register</button>
            </form>
        </div>
    );
};

export default Register;
