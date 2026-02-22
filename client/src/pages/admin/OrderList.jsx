import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Check, Clock, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/api/orders');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const markAsDelivered = async (id) => {
        try {
            await api.put(`/api/orders/${id}/deliver`);
            setOrders(orders.map(order =>
                order._id === id ? { ...order, isDelivered: true, orderStatus: 'Delivered' } : order
            ));
            toast.success('Order marked as delivered');
        } catch (error) {
            toast.error('Failed to update order');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Processing': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
            'Shipped': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
            'Delivered': 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
            'Cancelled': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
                {status}
            </span>
        );
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all">
                        {/* Card Header */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order ID</span>
                                <p className="font-mono font-bold text-gray-700 dark:text-gray-300">#{order._id.substring(0, 8)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                <div className="mt-1">{getStatusBadge(order.orderStatus)}</div>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User Details */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide border-b border-gray-100 dark:border-gray-800 pb-2">Customer Details</h4>
                                <div className="space-y-1 text-sm">
                                    <p className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Name:</span>
                                        <span className="font-medium text-gray-900 dark:text-white text-right">{order.user?.name || 'Guest'}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                                        <span className="font-medium text-gray-900 dark:text-white text-right">{order.shippingAddress?.phone || 'N/A'}</span>
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-gray-500 dark:text-gray-400 block mb-1">Shipping Address:</span>
                                        <p className="font-medium text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-xs leading-relaxed">
                                            {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
                                            {order.shippingAddress?.postalCode}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide border-b border-gray-100 dark:border-gray-800 pb-2">Order Items</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                                                <img
                                                    src={item.image || 'https://placehold.co/100x100?text=No+Img'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Error'; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">₹{item.price} X {item.quantity} x {(item.packSize === 1 && /\d/.test(item.unit || '')) ? '' : (item.packSize || 1)} {item.unit || 'kg'}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">₹{item.quantity * item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                                    {order.paymentMethod || 'Online'}
                                </span>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                                    <p className="text-xl font-bold text-primary-600 dark:text-primary-400">₹{order.totalPrice.toFixed(2)}</p>
                                </div>
                                {(!order.isDelivered && order.orderStatus !== 'Cancelled') && (
                                    <button
                                        onClick={() => markAsDelivered(order._id)}
                                        className="flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all"
                                    >
                                        <Truck className="w-4 h-4" />
                                        Deliver
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderList;
