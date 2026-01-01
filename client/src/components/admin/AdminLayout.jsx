import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Sprout, label: 'Products' },
        { path: '/admin/orders', icon: Package, label: 'Orders' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-20 flex flex-col w-20 lg:w-64 transition-all duration-300">
                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-gray-100">
                    <span className="text-2xl font-serif font-bold text-primary-600 flex items-center gap-2">
                        <ShoppingBag className="w-8 h-8" />
                        <span className="hidden lg:block">HarvestHub</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'bg-primary-50 text-primary-600 font-bold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                            `}
                            title={item.label}
                        >
                            <item.icon className="w-6 h-6 lg:w-5 lg:h-5" />
                            <span className="hidden lg:block">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
                        title="Sign Out"
                    >
                        <LogOut className="w-6 h-6 lg:w-5 lg:h-5" />
                        <span className="hidden lg:block">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-20 lg:ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
