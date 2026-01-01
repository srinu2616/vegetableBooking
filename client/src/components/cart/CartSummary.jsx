import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ total }) => {
    const navigate = useNavigate();
    const shipping = total > 500 ? 0 : 50;
    const finalTotal = total + shipping;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-premium border border-gray-100">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                    <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                        Free delivery on orders above ₹500
                    </div>
                )}
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">Total</span>
                    <span className="font-bold text-xl text-primary-600">₹{finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary-500/30 hover:bg-primary-700 transition-all duration-300 flex items-center justify-center space-x-2グループ"
            >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
            </button>

            <div className="mt-4 flex items-center justify-center space-x-2">
                <span className="text-xs text-gray-400">🔒 Secure Checkout by Razorpay</span>
            </div>
        </div>
    );
};

export default CartSummary;
