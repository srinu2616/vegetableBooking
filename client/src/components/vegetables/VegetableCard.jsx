import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { Plus, Star, ShoppingCart } from 'lucide-react';

const VegetableCard = ({ vegetable }) => {
    const { addToCart } = useCart();

    // Handle new images array or legacy image field
    const displayImage = vegetable.images && vegetable.images.length > 0
        ? vegetable.images[0]
        : (vegetable.image || 'https://placehold.co/400x300?text=No+Image');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-premium transition-all duration-300 overflow-hidden border border-gray-100"
        >
            {/* Badge for organic */}
            {vegetable.isOrganic && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md tracking-wide uppercase">
                        Organic
                    </span>
                </div>
            )}

            {/* Image with overlay */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50 flex items-center justify-center">
                <Link to={`/product/${vegetable._id}`} className="w-full h-full">
                    <img
                        src={displayImage}
                        alt={vegetable.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </Link>

                {/* Quick Add Button (Visible on Hover) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // For cart, ensure image is set
                        addToCart({ ...vegetable, image: displayImage });
                    }}
                    className="absolute bottom-4 right-4 bg-white text-primary-600 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-600 hover:text-white z-20"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {vegetable.name}
                    </h3>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-1.5 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold text-yellow-700">{vegetable.rating || 5}</span>
                    </div>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                    {vegetable.shortDescription || vegetable.description}
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <div>
                        <span className="text-xl font-bold text-gray-900">
                            ₹{vegetable.price}
                        </span>
                        <span className="text-gray-400 text-xs ml-1 font-medium">/ {vegetable.packSize || 1} {vegetable.unit}</span>
                    </div>

                    <button
                        onClick={() => {
                            const displayImage = vegetable.images && vegetable.images.length > 0
                                ? vegetable.images[0]
                                : (vegetable.image || 'https://placehold.co/400x300?text=No+Image');
                            addToCart({ ...vegetable, image: displayImage });
                        }}
                        className="bg-primary-50 text-primary-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center space-x-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default VegetableCard;
