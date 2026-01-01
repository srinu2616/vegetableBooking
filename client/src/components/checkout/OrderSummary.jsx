import React from 'react';

const OrderSummary = ({ cartItems, total }) => {
    const shipping = total > 500 ? 0 : 50;
    const finalTotal = total + shipping;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-premium border border-gray-100 h-fit">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto scrollbar-hide">
                {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} x {(item.packSize === 1 && /\d/.test(item.unit)) ? '' : (item.packSize || 1)} {item.unit}</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                    <span>Delivery</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
