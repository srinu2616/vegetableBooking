import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../components/checkout/AddressForm';
import OrderSummary from '../components/checkout/OrderSummary';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
        phone: ''
    });

    const [isEditingAddress, setIsEditingAddress] = useState(true);

    // Load saved address if exists
    React.useEffect(() => {
        if (user && user.address && user.address.address) {
            setAddress({
                ...user.address,
                phone: user.phone || ''
            });
            setIsEditingAddress(false);
        }
    }, [user]);

    const [paymentMethod, setPaymentMethod] = useState('Razorpay');

    const shipping = cartTotal > 500 ? 0 : 50;
    const finalTotal = cartTotal + shipping;

    const handlePayment = async () => {
        if (!address.address || !address.city || !address.postalCode || !address.phone) {
            toast.error("Please fill in all address details including phone");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order
            const orderData = {
                orderItems: cartItems.map(item => ({
                    vegetable: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image,
                    unit: item.unit,
                    packSize: item.packSize || 1
                })),
                shippingAddress: address,
                paymentMethod: paymentMethod, // 'Razorpay' or 'COD'
                itemsPrice: cartTotal,
                shippingPrice: shipping,
                totalPrice: finalTotal
            };

            const { data } = await api.post('/api/orders', orderData);

            if (paymentMethod === 'COD') {
                toast.success("Order Placed Successfully!");
                clearCart();
                navigate('/profile');
            } else {
                // Razorpay Logic
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_change_me',
                    amount: data.razorpayOrder.amount,
                    currency: data.razorpayOrder.currency,
                    name: "HarvestHub",
                    description: "Fresh Vegetables Order",
                    image: "https://cdn-icons-png.flaticon.com/512/3063/3063824.png",
                    order_id: data.razorpayOrder.id,
                    handler: async function (response) {
                        try {
                            const verifyData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                order_id: data.order._id
                            };

                            await api.post('/api/orders/verify-payment', verifyData);

                            toast.success("Payment Successful! Order Placed.");
                            clearCart();
                            navigate('/profile');
                        } catch (err) {
                            console.error(err);
                            toast.error("Payment Verification Failed");
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: address.phone
                    },
                    notes: {
                        address: "HarvestHub Office"
                    },
                    theme: {
                        color: "#22c55e"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    toast.error(response.error.description);
                });
                rzp1.open();
            }

        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Order creation failed");
        } finally {
            setLoading(false);
        }
    };

    // Load Razorpay Script dynamically if not present
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Address */}
                <div className="lg:col-span-2">
                    {!isEditingAddress ? (
                        <div className="bg-white p-6 rounded-3xl shadow-premium border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-serif font-bold text-gray-900">Delivery Address</h2>
                                <button
                                    onClick={() => setIsEditingAddress(true)}
                                    className="text-primary-600 font-medium hover:underline text-sm"
                                >
                                    Change Address
                                </button>
                            </div>
                            <div className="text-gray-600 space-y-1">
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p>{address.address}</p>
                                <p>{address.city}, {address.postalCode}</p>
                                <p>{address.country}</p>
                                <p className="flex items-center gap-2 mt-2">
                                    <span className="text-gray-400">Phone:</span>
                                    <span className="font-medium">{address.phone}</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <AddressForm address={address} setAddress={setAddress} />
                    )}
                </div>

                {/* Right Column: Summary & Payment */}
                <div className="lg:col-span-1 space-y-6">
                    <OrderSummary cartItems={cartItems} total={cartTotal} />

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
                        <div className="space-y-3">
                            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Razorpay"
                                        checked={paymentMethod === 'Razorpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                                    />
                                    <span className="ml-3 font-semibold text-gray-700">Online Payment (Razorpay)</span>
                                </div>
                            </label>

                            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                                    />
                                    <span className="ml-3 font-semibold text-gray-700">Cash on Delivery</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary-500/30 hover:bg-primary-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (paymentMethod === 'COD' ? 'Place Order' : `Pay ₹${finalTotal.toFixed(2)}`)}
                    </button>
                    <p className="text-xs text-center text-gray-400">
                        By placing this order, you agree to our Terms and Conditions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
