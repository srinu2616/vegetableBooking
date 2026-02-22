import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ total }) => {
    const navigate = useNavigate();
    const shipping = 0;
    const finalTotal = total + shipping;

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-premium border border-gray-100 dark:border-gray-800 transition-colors">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery Fee</span>
                    <span><span className="text-green-600 dark:text-green-400 font-medium">Free</span></span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-xl text-primary-600 dark:text-primary-400">₹{finalTotal.toFixed(2)}</span>
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
