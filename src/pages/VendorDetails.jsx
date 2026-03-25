import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Star, Clock, Check, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

const VendorDetails = () => {
    const { vendorId } = useParams();
    const [vendor, setVendor] = useState(null);
    const [services, setServices] = useState([]);
    const [cartCounts, setCartCounts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/categories/vendor/${vendorId}/services`).then(res => {
            setVendor(res.data.vendor);
            setServices(res.data.services);
        });
    }, [vendorId]);

    const handleAddToCart = async (service) => {
        const confirm = await Swal.fire({
            title: `Add ${service.name} to Cart?`,
            text: `Price: ₹${service.price}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#000',
            confirmButtonText: 'Yes, Add Service',
            cancelButtonText: 'Cancel'
        });

        if (confirm.isConfirmed) {
            try {
                await api.post('/api/cart', { serviceId: service._id });
                setCartCounts(prev => ({ ...prev, [service._id]: (prev[service._id] || 0) + 1 }));
                Swal.fire({
                    icon: 'success', title: 'Package Added!', toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000
                });
            } catch (error) {
                navigate('/login');
            }
        }
    };

    const handleIncrement = async (service) => {
        try {
            await api.post('/api/cart', { serviceId: service._id });
            setCartCounts(prev => ({ ...prev, [service._id]: prev[service._id] + 1 }));
        } catch (error) { }
    };

    const handleDecrement = (serviceId) => {
        // Just reducing visually. Actual removal requires a DELETE endpoint in cartController.
        setCartCounts(prev => ({ ...prev, [serviceId]: Math.max(0, prev[serviceId] - 1) }));
    };

    if (!vendor) return <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-[#f5f5f5] min-h-screen py-10 font-sans">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Area - Vendor Info */}
                <div className="md:col-span-4 bg-transparent pl-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f1014] mb-2">{vendor.name}</h1>
                    <div className="flex items-center text-sm font-bold text-gray-700 mb-6">
                        <Star className="w-4 h-4 mr-1 text-black fill-current" /> 
                        4.87 <span className="text-gray-400 font-medium ml-1">(1.1 M bookings)</span>
                    </div>
                    {vendor.image && (
                        <div className="w-full h-[250px] bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 hidden md:block">
                            <img src={vendor.image} alt="Vendor" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                {/* Right Area - Packages / Services */}
                <div className="md:col-span-8 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
                        <h2 className="text-2xl font-extrabold text-black mb-6">Packages</h2>
                        
                        <div className="divide-y divide-gray-100">
                            {services.length === 0 ? (
                                <p className="text-gray-500 py-10">No packages available for this preference.</p>
                            ) : (
                                services.map(srv => (
                                    <div key={srv._id} className="py-8 first:pt-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-4 gap-3">
                                            <div>
                                                <div className="text-[10px] font-bold tracking-widest text-green-700 uppercase mb-2 flex items-center">
                                                    <span className="w-2 h-2 bg-green-700 rounded-sm inline-block mr-2"></span> PACKAGE
                                                </div>
                                                <h3 className="text-xl font-bold text-[#0f1014] mb-1">{srv.name}</h3>
                                                <div className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                                                    <Star className="w-3 h-3 text-black fill-current mr-1" /> {srv.rating} <span className="text-gray-400 font-normal ml-1">({srv.reviews} reviews)</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-800 font-bold mb-4">
                                                    ₹{srv.price} <span className="mx-2 text-gray-300 font-normal">•</span> <Clock className="w-4 h-4 mr-1 text-gray-500" /> <span className="text-gray-500 font-medium">{srv.time}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-center">
                                                {srv.image && (
                                                    <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] bg-gray-100 rounded-lg overflow-hidden mb-[-12px] relative z-0 border border-gray-200">
                                                        <img src={srv.image} alt={srv.name} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                {(cartCounts[srv._id] && cartCounts[srv._id] > 0) ? (
                                                    <div className="w-[80px] sm:w-[100px] bg-white border border-gray-200 shadow-sm rounded-lg flex items-center justify-between px-1 sm:px-2 py-1 z-10 relative mt-2 text-sm">
                                                        <button onClick={() => handleDecrement(srv._id)} className="text-blue-600 font-bold px-2 py-1 hover:bg-gray-100 rounded">-</button>
                                                        <span className="font-bold text-blue-600 px-1 sm:px-2">{cartCounts[srv._id]}</span>
                                                        <button onClick={() => handleIncrement(srv)} className="text-blue-600 font-bold px-2 py-1 hover:bg-gray-100 rounded">+</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleAddToCart(srv)} className="w-[80px] sm:w-[100px] bg-white text-blue-600 font-bold border border-gray-200 shadow-sm rounded-lg px-2 sm:px-6 py-1.5 sm:py-2 z-10 hover:shadow-md transition relative mt-2 text-xs sm:text-sm uppercase">
                                                        Add
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Includes / Bullet points */}
                                        <ul className="space-y-2 mt-4">
                                            {srv.includes && srv.includes.length > 0 ? (
                                                srv.includes.map((inc, i) => (
                                                    <li key={i} className="text-sm font-medium text-gray-600 flex items-start">
                                                        <span className="mr-2 text-black mt-1">•</span> {inc}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-sm font-medium text-gray-600 flex items-start">
                                                    <span className="mr-2 text-black mt-1">•</span> {srv.description}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center py-10">
                        <h3 className="text-xl font-bold mb-4">UC Promise</h3>
                        <div className="flex flex-col space-y-3 w-full max-w-[200px]">
                            <div className="flex items-center text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-green-600 mr-3"/> Verified Professionals</div>
                            <div className="flex items-center text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-green-600 mr-3"/> Hassle Free Booking</div>
                            <div className="flex items-center text-sm font-medium text-gray-700"><Check className="w-5 h-5 text-green-600 mr-3"/> Transparent Pricing</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetails;
