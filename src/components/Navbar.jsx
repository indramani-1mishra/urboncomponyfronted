import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, User, MapPin, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 h-20 flex justify-between items-center">
                <div className="flex items-center space-x-2 sm:space-x-6">
                    <Link to="/" className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-black">
                        Urban<span className="text-black">Company</span>
                    </Link>
                    <div className="hidden md:flex items-center bg-gray-100 rounded-md px-4 py-2 hover:bg-gray-200 cursor-pointer transition">
                        <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-800">New Delhi</span>
                    </div>
                </div>

                <div className="hidden lg:flex flex-grow max-w-xl mx-8 relative">
                    <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search for services" 
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-md py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition"
                    />
                </div>

                <div className="flex items-center space-x-3 sm:space-x-6">
                    {user ? (
                        <>
                            <span className="font-semibold text-gray-700 hidden sm:block">Hi, {user.name}</span>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-gray-800 hover:text-black font-medium text-sm">Dashboard</Link>
                            )}
                            <Link to="/cart" className="relative text-gray-800 hover:text-black flex items-center">
                                <ShoppingCart className="w-6 h-6" />
                            </Link>
                            <button onClick={logout} className="text-gray-500 hover:text-black font-medium text-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-800 hover:text-black font-medium text-sm">
                                Login
                            </Link>
                            <Link to="/register" className="bg-black text-white px-5 py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
