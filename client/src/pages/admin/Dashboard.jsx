import React from 'react';
import api from '../../services/api';
import { Package, DollarSign, Users, Sprout } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
    </div>
);

const Dashboard = () => {
    const [statsData, setStatsData] = React.useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/api/orders/stats');
                setStatsData(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { title: 'Total Revenue', value: `₹${statsData.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
        { title: 'Total Orders', value: statsData.totalOrders, icon: Package, color: 'bg-blue-500' },
        { title: 'Products', value: statsData.totalProducts, icon: Sprout, color: 'bg-orange-500' },
        { title: 'Active Users', value: statsData.totalUsers, icon: Users, color: 'bg-purple-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="mt-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Welcome Admin!</h3>
                <p className="text-gray-500">Select an option from the sidebar to manage your store.</p>
            </div>
        </div>
    );
};

export default Dashboard;
