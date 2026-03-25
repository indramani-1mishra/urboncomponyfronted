import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import { Layers, Plus, ShoppingBag, Edit, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [carts, setCarts] = useState([]);
    
    // Forms state
    const [catName, setCatName] = useState('');
    const [catImage, setCatImage] = useState(null);
    const [subName, setSubName] = useState('');
    const [subCatId, setSubCatId] = useState('');
    
    const [categories, setCategories] = useState([]);
    const [allVendors, setAllVendors] = useState([]);
    
    const [vendorData, setVendorData] = useState({ name: '', price: '', description: '', subcategory: '', image: null });
    const [editMode, setEditMode] = useState(false);
    const [editVendorId, setEditVendorId] = useState(null);

    const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
    const [isSubmittingSub, setIsSubmittingSub] = useState(false);
    const [isSubmittingVendor, setIsSubmittingVendor] = useState(false);
    const [isSubmittingService, setIsSubmittingService] = useState(false);
    const [serviceData, setServiceData] = useState({ name: '', price: '', description: '', includes: '', vendor: '', time: '', image: null });

    const fetchData = () => {
        api.get('/api/cart/all').then(res => setCarts(res.data));
        api.get('/api/categories').then(res => setCategories(res.data));
        api.get('/api/categories/vendors/all').then(res => setAllVendors(res.data));
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const handleAddCategory = async () => {
        if (!catName) { return Swal.fire('Error', 'Category name is required', 'error'); }
        setIsSubmittingCategory(true);
        const formData = new FormData();
        formData.append('name', catName);
        if (catImage) formData.append('image', catImage);

        try {
            await api.post('/api/categories', formData);
            Swal.fire('Success', 'Category Added to Database', 'success');
            setCatName(''); setCatImage(null); fetchData();
        } catch(e) { Swal.fire('Error', 'Failed to add category', 'error'); }
        finally { setIsSubmittingCategory(false); }
    };

    const handleAddSubcategory = async () => {
        if (!subName || !subCatId) { return Swal.fire('Error', 'Subcategory name and parent required', 'error'); }
        setIsSubmittingSub(true);
        try {
            await api.post('/api/categories/subcategory', { name: subName, category: subCatId });
            Swal.fire('Success', 'Subcategory Added', 'success');
            setSubName('');
        } catch(e) { Swal.fire('Error', 'Failed to add subcategory', 'error'); }
        finally { setIsSubmittingSub(false); }
    };

    const handleVendorSubmit = async () => {
        if (!vendorData.name || !vendorData.price || !vendorData.subcategory) {
            return Swal.fire('Error', 'Please fill required vendor details', 'error');
        }
        setIsSubmittingVendor(true);
        
        const formData = new FormData();
        formData.append('name', vendorData.name);
        formData.append('price', vendorData.price);
        formData.append('description', vendorData.description);
        formData.append('subcategory', vendorData.subcategory);
        if (vendorData.image) formData.append('image', vendorData.image);

        try {
            if (editMode && editVendorId) {
                await api.put(`/api/categories/vendor/${editVendorId}`, formData);
                Swal.fire('Success', 'Professional Info Updated', 'success');
                setEditMode(false); setEditVendorId(null);
            } else {
                await api.post('/api/categories/vendor', formData);
                Swal.fire('Success', 'New Professional Added', 'success');
            }
            setVendorData({ name: '', price: '', description: '', subcategory: '', image: null });
            const fileInput = document.getElementById('vendorImageInput');
            if(fileInput) fileInput.value = '';
            fetchData();
        } catch(e) { Swal.fire('Error', 'Action failed', 'error'); }
        finally { setIsSubmittingVendor(false); }
    };

    const handleServiceSubmit = async () => {
        if (!serviceData.name || !serviceData.price || !serviceData.vendor) {
            return Swal.fire('Error', 'Please fill required service details', 'error');
        }
        setIsSubmittingService(true);
        const formData = new FormData();
        formData.append('name', serviceData.name);
        formData.append('price', serviceData.price);
        formData.append('description', serviceData.description);
        formData.append('includes', serviceData.includes);
        formData.append('vendor', serviceData.vendor);
        formData.append('time', serviceData.time || '1 hr 15 mins');
        if (serviceData.image) formData.append('image', serviceData.image);

        try {
            await api.post('/api/categories/service', formData);
            Swal.fire('Success', 'New Service Package Added', 'success');
            setServiceData({ name: '', price: '', description: '', includes: '', vendor: '', time: '', image: null });
            const fileInput = document.getElementById('srvImageInput');
            if(fileInput) fileInput.value = '';
            fetchData();
        } catch(e) { Swal.fire('Error', 'Action failed', 'error'); }
        finally { setIsSubmittingService(false); }
    };

    const loadEditVendor = (v) => {
        setVendorData({
            name: v.name,
            price: v.price,
            description: v.description || '',
            subcategory: v.subcategory?._id || '',
            image: null
        });
        setEditMode(true);
        setEditVendorId(v._id);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    if (!user || user.role !== 'admin') return <div className="text-center mt-20 text-2xl font-bold text-red-500 font-sans">Access Denied</div>;

    return (
        <div className="bg-[#f5f5f5] min-h-screen py-10 font-sans">
            <div className="max-w-[1200px] mx-auto space-y-8 px-4">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex items-center mb-6 text-black">
                    <Layers className="w-10 h-10 mr-4" />
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard & Inventory Control</h1>
                        <p className="text-gray-500 font-medium">Manage Services and Bookings with Cloudinary Uploads</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Add Category */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                        <h3 className="text-xl font-bold mb-6 flex items-center border-b pb-3"><Plus className="mr-2 text-black"/> Add Category</h3>
                        <div className="flex-grow">
                            <input type="text" placeholder="Category Name" value={catName} onChange={e => setCatName(e.target.value)} className="w-full px-4 py-3 mb-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-black" />
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category Icon (Upload)</label>
                            <input type="file" onChange={e => setCatImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4" />
                        </div>
                        <button onClick={handleAddCategory} disabled={isSubmittingCategory} className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isSubmittingCategory ? 'Adding Category...' : 'Create Category'}
                        </button>
                    </div>

                    {/* Add Subcategory */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                        <h3 className="text-xl font-bold mb-6 flex items-center border-b pb-3"><Plus className="mr-2 text-black"/> Add Subcategory</h3>
                        <div className="flex-grow">
                            <select value={subCatId} onChange={e => setSubCatId(e.target.value)} className="w-full px-4 py-3 mb-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-black">
                                <option value="">Select Parent Category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <input type="text" placeholder="Subcategory Name" value={subName} onChange={e => setSubName(e.target.value)} className="w-full px-4 py-3 mb-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-black" />
                        </div>
                        <button onClick={handleAddSubcategory} disabled={isSubmittingSub} className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isSubmittingSub ? 'Adding Subcategory...' : 'Create Subcategory'}
                        </button>
                    </div>

                    {/* Add/Edit Vendor */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full ring-2 ring-transparent transition-all" style={editMode ? {boxShadow: '0 0 0 2px #000'} : {}}>
                        <h3 className="text-xl font-bold mb-6 flex items-center border-b pb-3 text-black">
                            {editMode ? <Edit className="mr-2"/> : <Plus className="mr-2"/>}
                            {editMode ? 'Edit Professional' : 'Add Professional'}
                        </h3>
                        <div className="flex-grow space-y-3">
                            <input type="text" placeholder="Subcategory _id (ObjectId)" value={vendorData.subcategory} onChange={e => setVendorData({...vendorData, subcategory: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm" />
                            <input type="text" placeholder="Service / Vendor Name" value={vendorData.name} onChange={e => setVendorData({...vendorData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md" />
                            <input type="number" placeholder="Price (₹)" value={vendorData.price} onChange={e => setVendorData({...vendorData, price: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md" />
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Service Image (Cloudinary)</label>
                                <input id="vendorImageInput" type="file" onChange={e => setVendorData({...vendorData, image: e.target.files[0]})} className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700" />
                            </div>
                            <textarea placeholder="Service Description" value={vendorData.description} onChange={e => setVendorData({...vendorData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md resize-none" rows="2"></textarea>
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button onClick={handleVendorSubmit} disabled={isSubmittingVendor} className="flex-1 bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isSubmittingVendor ? 'Saving...' : (editMode ? 'Update Service' : 'Add Service')}
                            </button>
                            {editMode && (
                                <button onClick={() => { setEditMode(false); setVendorData({ name: '', price: '', description: '', subcategory: '', image: null }); setEditVendorId(null); }} className="bg-gray-200 text-gray-800 px-4 rounded-md font-bold hover:bg-gray-300 transition">Cancel</button>
                            )}
                        </div>
                    </div>

                    {/* Add Service */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full ring-2 ring-transparent transition-all">
                        <h3 className="text-xl font-bold mb-6 flex items-center border-b pb-3 text-black">
                            <Plus className="mr-2"/> Add Package to Preference
                        </h3>
                        <div className="flex-grow space-y-3">
                            <input type="text" placeholder="Vendor _id (ObjectId)" value={serviceData.vendor} onChange={e => setServiceData({...serviceData, vendor: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm" />
                            <input type="text" placeholder="Package Name (e.g. Complete Care)" value={serviceData.name} onChange={e => setServiceData({...serviceData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md" />
                            <input type="number" placeholder="Price (₹)" value={serviceData.price} onChange={e => setServiceData({...serviceData, price: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md" />
                            <input type="text" placeholder="Time (e.g. 45 mins)" value={serviceData.time} onChange={e => setServiceData({...serviceData, time: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm" />
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Package Image</label>
                                <input id="srvImageInput" type="file" onChange={e => setServiceData({...serviceData, image: e.target.files[0]})} className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700" />
                            </div>
                            <input type="text" placeholder="Includes (comma separated)" value={serviceData.includes} onChange={e => setServiceData({...serviceData, includes: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm" />
                            <textarea placeholder="Description" value={serviceData.description} onChange={e => setServiceData({...serviceData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md resize-none text-sm" rows="2"></textarea>
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button onClick={handleServiceSubmit} disabled={isSubmittingService} className="flex-1 bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isSubmittingService ? 'Saving...' : 'Add Package'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vendors List Section (For Editing) */}
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mt-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center pb-4 border-b">
                        <Layers className="w-7 h-7 mr-3 text-black" /> Existing Professionals / Services
                    </h2>
                    {allVendors.length === 0 ? <p className="text-gray-500 py-4">No services found.</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {allVendors.map(v => (
                                <div key={v._id} className="border border-gray-200 rounded-lg p-4 flex flex-col shadow-sm">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <img src={v.image || 'https://via.placeholder.com/80'} alt="" className="w-16 h-16 object-cover rounded bg-gray-100" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-tight">{v.name}</h4>
                                            <p className="text-xs text-blue-600 font-semibold mb-1">{v.subcategory?.name}</p>
                                            <p className="font-bold text-gray-700 text-sm">₹{v.price}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => loadEditVendor(v)} className="mt-auto w-full py-2 bg-gray-50 border border-gray-200 rounded text-sm font-bold text-gray-700 hover:bg-gray-100 transition flex justify-center items-center">
                                        <Edit className="w-4 h-4 mr-2"/> Edit Profile
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User Bookings & Carts Tracker */}
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mt-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center pb-4 border-b">
                        <ShoppingBag className="w-7 h-7 mr-3 text-black" /> User Bookings & Carts Tracker
                    </h2>
                    {carts.length === 0 ? <p className="text-gray-500 py-10 text-center text-lg">No bookings or active carts present.</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-y border-gray-200">
                                        <th className="px-6 py-4 font-bold text-gray-700">Customer</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Services in Cart/Booked</th>
                                        <th className="px-6 py-4 font-bold text-gray-700 text-right">Total Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {carts.map(cart => {
                                        const subTotal = cart.items.reduce((acc, it) => acc + (it.service?.price || 0), 0);
                                        return (
                                            <tr key={cart._id} className="hover:bg-gray-50/50 transition">
                                                <td className="px-6 py-6 align-top max-w-[200px]">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex justify-center items-center font-bold text-lg">
                                                            {cart.user?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 leading-tight">{cart.user?.name}</div>
                                                            <div className="text-sm font-medium text-gray-500">{cart.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-medium text-gray-800">
                                                    <div className="space-y-3">
                                                        {cart.items.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center bg-white p-3 border border-gray-100 rounded shadow-sm">
                                                                <span className="truncate pr-4">{item.service?.name}</span>
                                                                <span className="font-bold bg-gray-100 px-3 py-1 rounded-md">₹{item.service?.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 align-top text-right">
                                                    <div className="text-2xl font-extrabold text-black">₹{subTotal}</div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
