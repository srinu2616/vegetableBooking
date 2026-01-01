import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const Cart = () => {
    const { cartItems, cartTotal } = useCart();
    const [parent] = useAutoAnimate();

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[60vh] text-center">
                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-primary-300" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Looks like you haven't added anything to your cart yet. Browse our shop to find fresh vegetables!
                </p>
                <Link
                    to="/shop"
                    className="bg-primary-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-primary-500/30 hover:bg-primary-700 transition-all"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="lg:w-2/3">
                    <div ref={parent}>
                        {cartItems.map((item) => (
                            <CartItem key={item._id} item={item} />
                        ))}
                    </div>

                    <Link
                        to="/shop"
                        className="inline-flex items-center space-x-2 text-gray-500 hover:text-primary-600 mt-6 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Continue Shopping</span>
                    </Link>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:w-1/3">
                    <div className="sticky top-24">
                        <CartSummary total={cartTotal} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
