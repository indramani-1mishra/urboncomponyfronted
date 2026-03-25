import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, CheckCircle, X, Check } from 'lucide-react';

const CATEGORIES = [
    { name: "Women's Salon & Spa", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Men's Salon & Massage", img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "AC & Appliance Repair", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Cleaning & Pest Control", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Electrician, Plumber", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=200&h=200" },
];

const NEW_SERVICES = [
    { title: "Native Water Purifier", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop" },
    { title: "Smart Locks", img: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop" }
];

const MOST_BOOKED = [
    { title: "Intense Cleaning", rating: "4.8", reviews: "10K", price: "₹899", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop" },
    { title: "AC Service", rating: "4.7", reviews: "25K", price: "₹499", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop" },
    { title: "Men's Haircut", rating: "4.9", reviews: "40K", price: "₹249", img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=200&fit=crop" },
];

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedSub, setSelectedSub] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/categories').then(res => setCategories(res.data));
    }, []);

    const fetchSubcategories = (categoryId, categoryName) => {
        axios.get(`http://localhost:5000/api/categories/${categoryId}/subcategories`).then(res => {
            setSubcategories(res.data);
            setSelectedCategory({ id: categoryId, name: categoryName });
            setVendors([]);
            setSelectedSub(null);
        });
    };

    const fetchVendors = (subId, subName) => {
        axios.get(`http://localhost:5000/api/categories/subcategory/${subId}/vendors`).then(res => {
            setVendors(res.data);
            setSelectedSub({ id: subId, name: subName });
        });
    };

    const processNavigation = (vendorId) => {
        navigate(`/vendor/${vendorId}`);
        closeModal();
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setSubcategories([]);
        setVendors([]);
        setSelectedSub(null);
    };

    return (
        <div className="font-sans bg-gray-50 min-h-screen">
            {/* Modal Overlay */}
            {selectedCategory && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-xl font-bold text-black flex items-center">
                                {selectedSub ? (
                                    <>
                                        <button onClick={() => {setSelectedSub(null); setVendors([]);}} className="mr-2 hover:bg-gray-200 p-1 rounded-full"><ChevronDown className="w-5 h-5 rotate-90"/></button>
                                        {selectedSub.name}
                                    </>
                                ) : (
                                    selectedCategory.name
                                )}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {!selectedSub ? (
                                <>
                                    <p className="text-sm text-gray-500 font-semibold mb-4 uppercase tracking-wide">Select a subcategory</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {subcategories.map(sub => (
                                            <div 
                                                key={sub._id} 
                                                onClick={() => fetchVendors(sub._id, sub.name)}
                                                className="bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 p-4 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition text-center flex flex-col items-center justify-center h-32"
                                            >
                                                <h3 className="font-bold text-gray-800">{sub.name}</h3>
                                            </div>
                                        ))}
                                        {subcategories.length === 0 && <p className="col-span-2 text-gray-400">No subcategories found.</p>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-500 font-semibold mb-4 uppercase tracking-wide">Select your preference</p>
                                    <div className="space-y-4">
                                        {vendors.map(v => (
                                            <div 
                                                key={v._id} 
                                                onClick={() => processNavigation(v._id)}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-black cursor-pointer group transition-all"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-14 h-14 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                                        {v.image ? <img src={v.image} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-200"/>}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-black">{v.name}</h3>
                                                        <div className="flex space-x-2 mt-1">
                                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded tracking-wide font-medium">LUXURY</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronDown className="w-5 h-5 -rotate-90 text-gray-400 group-hover:text-black transition-colors" />
                                            </div>
                                        ))}
                                        {vendors.length === 0 && <p className="text-gray-400">No preferences found.</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* HERO SECTION */}
            <div className="bg-[#f5f5f5] pt-12 pb-20 px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0f1014] mb-8 leading-tight">
                            Home services at your doorstep
                        </h1>

                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-xl">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">What are you looking for?</h2>
                            <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                                {categories.slice(0, 6).map((cat, i) => (
                                    <div key={cat._id || i} onClick={() => fetchSubcategories(cat._id, cat.name)} className="flex flex-col items-center cursor-pointer group">
                                        <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center mb-3 group-hover:shadow-md transition overflow-hidden p-1">
                                            <img src={cat.image || CATEGORIES[i % CATEGORIES.length].img} alt={cat.name} className="w-full h-full object-cover rounded" />
                                        </div>
                                        <span className="text-xs font-semibold text-center text-gray-700 leading-tight w-20">{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[500px]">
                            <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80" alt="Professional Service" className="w-full h-auto rounded-[32px] object-cover shadow-2xl" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Most Booked */}
            <div className="max-w-7xl mx-auto px-8 py-16 border-t border-gray-200">
                <h2 className="text-3xl font-extrabold text-[#0f1014] mb-10">Most Booked Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOST_BOOKED.map((srv, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition">
                            <div className="h-44 bg-gray-100">
                                <img src={srv.img} alt={srv.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900">{srv.title}</h3>
                                <p className="text-sm font-semibold text-gray-600 mt-1">⭐ {srv.rating} ({srv.reviews})</p>
                                <p className="font-bold text-gray-900 mt-2">{srv.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
