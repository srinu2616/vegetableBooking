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
            'Processing': 'bg-yellow-50 text-yellow-700',
            'Shipped': 'bg-blue-50 text-blue-700',
            'Delivered': 'bg-green-50 text-green-700',
            'Cancelled': 'bg-red-50 text-red-700',
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
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                        {/* Card Header */}
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Order ID</span>
                                <p className="font-mono font-bold text-gray-700">#{order._id.substring(0, 8)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                <div className="mt-1">{getStatusBadge(order.orderStatus)}</div>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User Details */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">Customer Details</h4>
                                <div className="space-y-1 text-sm">
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Name:</span>
                                        <span className="font-medium text-gray-900 text-right">{order.user?.name || 'Guest'}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Phone:</span>
                                        <span className="font-medium text-gray-900 text-right">{order.shippingAddress?.phone || 'N/A'}</span>
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-gray-500 block mb-1">Shipping Address:</span>
                                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded-lg text-xs leading-relaxed">
                                            {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
                                            {order.shippingAddress?.postalCode}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">Order Items</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-white rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img
                                                    src={item.image || 'https://placehold.co/100x100?text=No+Img'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Error'; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500">₹{item.price} X {item.quantity} x {(item.packSize === 1 && /\d/.test(item.unit || '')) ? '' : (item.packSize || 1)} {item.unit || 'kg'}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">₹{item.quantity * item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                                <span className="text-sm font-bold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                                    {order.paymentMethod || 'Online'}
                                </span>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                    <p className="text-xl font-bold text-primary-600">₹{order.totalPrice.toFixed(2)}</p>
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
