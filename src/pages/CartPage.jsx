import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Trash2 } from 'lucide-react';

const CartPage = () => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        if (user) {
            api.get('/api/cart')
                .then(res => setCart(res.data))
                .catch(err => console.log(err));
        }
    }, [user]);

    const handleRemove = async (itemId) => {
        try {
            await api.delete(`/api/cart/${itemId}`);
            setCart(prev => ({...prev, items: prev.items.filter(it => it._id !== itemId)}));
        } catch (error) {
            console.log(error);
        }
    };

    if (!user) return <div className="text-center mt-20 text-2xl font-semibold text-gray-600">Please login to view your cart</div>;

    const total = cart?.items?.reduce((acc, item) => acc + (item.service?.price || 0), 0) || 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 bg-white min-h-[80vh] font-sans">
            <h2 className="text-3xl font-extrabold text-[#0f1014] mb-12 flex items-center border-b pb-4">
                <ShoppingCart className="w-8 h-8 mr-4 text-black" /> Cart Checkout
            </h2>
            {cart && cart.items && cart.items.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <ul className="divide-y divide-gray-100 p-8">
                        {cart.items.map((item, idx) => (
                            <li key={idx} className="py-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{item.service?.name}</h3>
                                    <p className="text-sm font-medium text-gray-400 max-w-sm">{item.service?.description}</p>
                                    {item.service?.vendor && (
                                        <div className="mt-2 text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded inline-block">
                                            Provided by: {item.service.vendor.name}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 border-t sm:border-0 border-gray-100 pt-4 sm:pt-0">
                                    <span className="text-xl font-bold text-gray-900">₹{item.service?.price}</span>
                                    <button onClick={() => handleRemove(item._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition" title="Remove Item">
                                        <Trash2 className="w-5 h-5"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-gray-50 border-t border-gray-100 p-8 flex justify-between items-center">
                        <div>
                            <span className="text-lg font-bold text-gray-600 block">Total Amount</span>
                            <span className="text-xs text-green-600 font-bold">Includes all taxes and fees</span>
                        </div>
                        <span className="text-4xl font-extrabold text-black">₹{total}</span>
                    </div>
                    <div className="p-8 pt-0 bg-gray-50">
                         <button className="w-full bg-black text-white font-bold text-lg py-4 rounded-md hover:bg-gray-800 transition">Proceed to Checkout</button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-32 bg-gray-50 rounded-2xl border border-gray-100">
                    <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <p className="text-xl text-gray-500 font-medium">Your cart is empty.</p>
                </div>
            )}
        </div>
    );
};

export default CartPage;
