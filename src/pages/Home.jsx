import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, CheckCircle, X, Check, Star, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { name: "Women's Salon & Spa", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Men's Salon & Massage", img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "AC & Appliance Repair", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Cleaning & Pest Control", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Electrician, Plumber", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=200&h=200" },
];

const NEW_SERVICES = [
    { title: "Native Water Purifier", label: "SALE", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop" },
    { title: "Smart Locks", label: "NEW", img: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop" }
];

const MOST_BOOKED = [
    { title: "Intense Cleaning", rating: "4.8", reviews: "10K", price: "₹899", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop" },
    { title: "AC Service", rating: "4.7", reviews: "25K", price: "₹499", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop" },
    { title: "Men's Haircut", rating: "4.9", reviews: "40K", price: "₹249", img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=200&fit=crop" },
    { title: "Plumbing Services", rating: "4.6", reviews: "15K", price: "₹199", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&h=200&fit=crop" },
];

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedSub, setSelectedSub] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/api/categories').then(res => setCategories(res.data));
    }, []);

    const fetchSubcategories = (categoryId, categoryName) => {
        api.get(`/api/categories/${categoryId}/subcategories`).then(res => {
            setSubcategories(res.data);
            setSelectedCategory({ id: categoryId, name: categoryName });
            setVendors([]);
            setSelectedSub(null);
        });
    };

    const fetchVendors = (subId, subName) => {
        api.get(`/api/categories/subcategory/${subId}/vendors`).then(res => {
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
            {/* Modal Overlay with AnimatePresence */}
            <AnimatePresence>
                {selectedCategory && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-white px-6 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 z-10">
                                <h2 className="text-xl font-extrabold text-black flex items-center tracking-tight">
                                    {selectedSub ? (
                                        <>
                                            <button onClick={() => {setSelectedSub(null); setVendors([]);}} className="mr-3 hover:bg-gray-100 p-2 rounded-full transition"><ChevronDown className="w-5 h-5 rotate-90"/></button>
                                            {selectedSub.name}
                                        </>
                                    ) : (
                                        selectedCategory.name
                                    )}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 bg-gray-50 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
                                </button>
                            </div>
                            
                            {/* Modal Body */}
                            <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar bg-gray-50/50">
                                {!selectedSub ? (
                                    <>
                                        <p className="text-xs text-gray-400 font-bold mb-4 uppercase tracking-widest pl-1">Select a service category</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {subcategories.map((sub, i) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                    key={sub._id} 
                                                    onClick={() => fetchVendors(sub._id, sub.name)}
                                                    className="bg-white hover:bg-black group border border-gray-100 p-5 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all text-center flex flex-col items-center justify-center h-36"
                                                >
                                                    <h3 className="font-bold text-gray-800 group-hover:text-white transition-colors">{sub.name}</h3>
                                                </motion.div>
                                            ))}
                                            {subcategories.length === 0 && <p className="col-span-2 text-gray-400 p-4 text-center">No categories found.</p>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs text-gray-400 font-bold mb-4 uppercase tracking-widest pl-1">Select a Professional</p>
                                        <div className="space-y-4">
                                            {vendors.map((v, i) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                                    key={v._id} 
                                                    onClick={() => processNavigation(v._id)}
                                                    className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-2xl hover:border-black hover:shadow-md cursor-pointer group transition-all"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                                                            {v.image ? <img src={v.image} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-200"/>}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-extrabold text-lg text-black group-hover:text-blue-600 transition-colors">{v.name}</h3>
                                                            <div className="flex space-x-2 mt-1">
                                                                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded font-bold uppercase tracking-wider flex items-center"><ShieldCheck className="w-3 h-3 mr-1"/> Verified</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronDown className="w-5 h-5 -rotate-90 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                                </motion.div>
                                            ))}
                                            {vendors.length === 0 && <p className="text-gray-400 text-center p-4">No professionals found.</p>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HERO SECTION */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left">
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-[#0f1014] mb-6 leading-[1.15] tracking-tight">
                            Home services <br className="hidden lg:block"/> at your doorstep
                        </h1>
                        <p className="text-gray-500 text-lg mb-8 font-medium">Premium, verified professionals for all your home needs.</p>

                        {/* Faux Search Bar */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 flex items-center mb-10 max-w-lg shadow-sm focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                            <Search className="w-5 h-5 text-gray-400 ml-3" />
                            <input 
                                type="text" 
                                placeholder="Search for 'AC service', 'Cleaning'..." 
                                className="w-full bg-transparent border-none focus:outline-none px-4 py-3 text-gray-800 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Grid */}
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1 mb-4">What do you need?</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-y-8 gap-x-4 max-w-xl text-center">
                            {categories.slice(0, 6).map((cat, i) => (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={cat._id || i} onClick={() => fetchSubcategories(cat._id, cat.name)} className="flex flex-col items-center cursor-pointer group">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-black transition-colors overflow-hidden p-2 sm:p-3 shadow-sm group-hover:shadow-lg">
                                        <img src={cat.image || CATEGORIES[i % CATEGORIES.length].img} alt={cat.name} className="w-full h-full object-cover rounded-xl group-hover:opacity-90" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold text-gray-800 leading-tight w-20 sm:w-24 group-hover:text-black">{cat.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex-1 w-full max-w-[550px]">
                        <div className="relative aspect-square md:aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80" alt="Professional Service" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 border-4 border-white/20 rounded-[2.5rem] pointer-events-none"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* New and Noteworthy Section */}
            <div className="bg-gray-50 py-16 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-black text-[#0f1014] mb-8 tracking-tight">New & Noteworthy</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {NEW_SERVICES.map((srv, idx) => (
                            <motion.div whileHover={{ y: -5 }} key={idx} className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group h-64">
                                <img src={srv.img} alt={srv.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 inline-block">
                                        {srv.label}
                                    </span>
                                    <h3 className="text-2xl font-black text-white">{srv.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Most Booked */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl font-black text-[#0f1014] tracking-tight">Most Booked Services</h2>
                    <a className="text-blue-600 font-bold hover:underline cursor-pointer hidden md:block">See All</a>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOST_BOOKED.map((srv, idx) => (
                        <motion.div whileHover={{ y: -5 }} key={idx} className="bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden cursor-pointer group flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img src={srv.img} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-5 flex-grow flex flex-col">
                                <div className="flex items-center text-sm font-bold text-gray-800 mb-1">
                                    <Star className="w-4 h-4 text-black fill-current mr-1" /> 
                                    {srv.rating} <span className="text-gray-400 font-medium ml-1">({srv.reviews})</span>
                                </div>
                                <h3 className="font-extrabold text-gray-900 text-lg mb-2">{srv.title}</h3>
                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <p className="font-black text-gray-900 text-xl">{srv.price}</p>
                                    <button className="bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-colors">
                                        View
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            {/* Value Props Section */}
            <div className="max-w-7xl mx-auto px-6 py-10 sm:py-16 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600"><ShieldCheck className="w-8 h-8"/></div>
                        <h3 className="font-bold text-lg text-black mb-2">Verified Professionals</h3>
                        <p className="text-gray-500 text-sm font-medium">Every professional on our platform is strictly background checked.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600"><CheckCircle className="w-8 h-8"/></div>
                        <h3 className="font-bold text-lg text-black mb-2">Safe & Hygienic</h3>
                        <p className="text-gray-500 text-sm font-medium">Ensuring safety and hygiene with our standardized operating procedures.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600"><Star className="w-8 h-8"/></div>
                        <h3 className="font-bold text-lg text-black mb-2">Service Guarantee</h3>
                        <p className="text-gray-500 text-sm font-medium">Re-work is guaranteed if you're not fully satisfied with our service.</p>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Home;
