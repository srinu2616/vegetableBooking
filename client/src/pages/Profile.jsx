import React from 'react';
import { useAuth } from '../context/AuthContext';
import OrderHistory from '../components/orders/OrderHistory';
import { LogOut, User, Mail } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-premium border border-gray-100 text-center sticky top-24">
                        <div className="w-24 h-24 mx-auto bg-primary-50 rounded-full p-1 mb-4">
                            <img
                                src={user.profilePic}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
                        <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm mb-6">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-xl font-medium transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Orders Content */}
                <div className="md:col-span-2">
                    <OrderHistory />
                </div>
            </div>
        </div>
    );
};

export default Profile;
