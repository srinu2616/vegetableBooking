import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/api/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
            case 'Shipped': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Processing': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'Cancelled': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order? Item quantities will be restored to store stock.')) {
            try {
                await api.put(`/api/orders/${orderId}/cancel`);
                toast.success('Order cancelled successfully');
                // Refresh orders
                const { data } = await api.get('/api/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error("Failed to cancel order", error);
                toast.error(error.response?.data?.message || 'Failed to cancel order');
            }
        }
    };

    const handleReorder = (items) => {
        items.forEach(item => {
            // Adapt item structure if needed for addToCart
            // addToCart expects: { _id, name, price, image, ... }
            // item here has: { vegetable (id), name, price, image, quantity }
            addToCart({
                _id: item.vegetable,
                name: item.name,
                price: item.price,
                image: item.image,
                stock: 999 // Assume stock available or check later, simple re-add
            }, item.quantity);
        });
        toast.success("Items added to cart");
        navigate('/cart');
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-10">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Order History</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 pb-4 border-b border-gray-50 dark:border-gray-800">
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wide">Order ID</span>
                                <p className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">#{order._id}</p>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                                    {order.orderStatus === 'Processing' && <Clock className="w-3 h-3" />}
                                    <span>{order.orderStatus}</span>
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors">
                                            <img
                                                src={item.image || 'https://placehold.co/100x100?text=No+Image'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                                            <p className="text-sm text-gray-500">₹{item.price} X {item.quantity} x {(item.packSize === 1 && /\d/.test(item.unit || '')) ? '' : (item.packSize || 1)} {item.unit || 'kg'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-xs text-gray-400">Total</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <div className="flex gap-4">
                                {order.orderStatus === 'Processing' && (
                                    <button
                                        onClick={() => handleCancelOrder(order._id)}
                                        className="text-red-500 hover:text-red-600 text-sm font-medium hover:underline transition-all flex items-center gap-1"
                                    >
                                        <XCircle className="w-4 h-4" /> Cancel Order
                                    </button>
                                )}
                                {order.orderStatus === 'Cancelled' && (
                                    <button
                                        onClick={() => handleReorder(order.items)}
                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline transition-all flex items-center gap-1"
                                    >
                                        <Package className="w-4 h-4" /> Place Order Again
                                    </button>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-gray-500 text-sm mr-2">Total Amount</span>
                                <span className="font-serif font-bold text-lg text-primary-600">₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
