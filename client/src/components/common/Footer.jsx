import React from 'react';
import { Leaf, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-serif text-xl font-bold text-gray-900">
                                Vegetables<span className="text-primary-600">Hub</span>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Bringing the freshest, organic produce directly from local farms to your table. Quality you can taste, freshness you can trust.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-500 hover:text-white transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif font-semibold text-gray-900 mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Shop', path: '/shop' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Contact', path: '/contact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-gray-500 hover:text-primary-600 text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-serif font-semibold text-gray-900 mb-6">Support</h4>
                        <ul className="space-y-3">
                            {['FAQ', 'Shipping Policy', 'Returns', 'Privacy Policy', 'Terms of Service'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-serif font-semibold text-gray-900 mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-sm text-gray-500">
                                <MapPin className="w-5 h-5 text-primary-500 shrink-0" />
                                <span>Opposite to Trends, Apsari Road,<br />Adoni, AP 518301</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-gray-500">
                                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                                <span>+91 9849946615</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-gray-500">
                                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                                <span>balayya375@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} VegetablesHub. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 contrast-0 grayscale" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 opacity-50 contrast-0 grayscale" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
