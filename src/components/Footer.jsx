import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-gray-300 py-16 font-sans">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-800 pb-12 mb-8">
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Anti-discrimination Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">For Customers</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-white transition">UC Reviews</a></li>
                            <li><a href="#" className="hover:text-white transition">Categories</a></li>
                            <li><a href="#" className="hover:text-white transition">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">For Partners</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-white transition">Register as a Professional</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Download our App</h3>
                        <div className="space-y-4">
                            <img src="https://images.urbancompany.com/business-web/image/upload/v1615555620/web-assets/App_store.png" alt="App Store" className="w-[150px] cursor-pointer bg-white rounded" />
                            <img src="https://images.urbancompany.com/business-web/image/upload/v1615555621/web-assets/Play_store.png" alt="Google Play" className="w-[150px] cursor-pointer bg-white rounded" />
                        </div>
                    </div>
                </div>
                <div className="text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} UrbanCompany Clone by Built for You. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
