import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const [localQuantity, setLocalQuantity] = React.useState(item.quantity.toString());

    // Sync from props when item.quantity changes externally
    React.useEffect(() => {
        setLocalQuantity(item.quantity.toString());
    }, [item.quantity]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setLocalQuantity(val); // Allow typing anything (including empty string)

        const parsedJson = parseInt(val);
        // Only update global cart if it's a valid positive number
        if (!isNaN(parsedJson) && parsedJson > 0) {
            updateQuantity(item._id, parsedJson);
        }
    };

    const handleBlur = () => {
        // On blur, if invalid/empty, revert to actual quantity
        const parsedJson = parseInt(localQuantity);
        if (isNaN(parsedJson) || parsedJson <= 0) {
            setLocalQuantity(item.quantity.toString());
        }
    };

    return (
        <div className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm mb-4 transition-all hover:shadow-md">
            {/* Image */}
            <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                    <h3 className="font-serif font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-500 text-sm">
                        ₹{item.price} / {(item.packSize === 1 && /\d/.test(item.unit)) ? '' : (item.packSize || 1)} {item.unit}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mt-4 sm:mt-0 space-x-6">
                    {/* Quantity */}
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                        <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`p-1 rounded-md transition-colors ${item.quantity <= 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-white hover:text-primary-600 shadow-sm'
                                }`}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex items-center">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={localQuantity}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className="w-12 text-center bg-transparent font-medium text-gray-900 outline-none p-0"
                            />
                            <span className="text-xs text-gray-500 font-medium ml-1 whitespace-nowrap">{(item.packSize === 1 && /\d/.test(item.unit)) ? '' : (item.packSize || 1)} {item.unit}</span>
                        </div>
                        <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:bg-white hover:text-primary-600 rounded-md shadow-sm transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Total Price & Delete */}
                    <div className="flex items-center space-x-4">
                        <span className="font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
