import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Menu, X, Search, Leaf, User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-premium py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-400/50 transition-all duration-300">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
                            Harvest<span className="text-primary-600">Hub</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary-600 relative group ${location.pathname === link.path ? 'text-primary-600' : 'text-gray-600'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`} />
                            </Link>
                        ))}
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin/dashboard"
                                className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                            >
                                Admin Panel
                            </Link>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 md:space-x-5">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <Search className="w-5 h-5" />
                        </button>

                        {user && (
                            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 group">
                                <ShoppingCart className="w-5 h-5 group-hover:text-primary-600 transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="hidden md:flex items-center space-x-3">
                                <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-50 rounded-full p-1 pr-3 transition-colors border border-transparent hover:border-gray-200">
                                    <img
                                        src={user.profilePic}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-primary-100"
                                    />
                                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${location.pathname === link.path
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <hr className="my-2 border-gray-100" />

                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin/dashboard"
                                    className="block px-4 py-3 rounded-lg text-base font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors mb-2"
                                >
                                    Admin Panel
                                </Link>
                            )}

                            <hr className="my-2 border-gray-100" />

                            {user ? (
                                <>
                                    <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50">
                                        <img src={user.profilePic} alt={user.name} className="w-8 h-8 rounded-full" />
                                        <span className="font-medium text-gray-700">{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block w-full text-center px-4 py-3 bg-primary-600 text-white font-medium rounded-lg shadow-md active:bg-primary-700"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
