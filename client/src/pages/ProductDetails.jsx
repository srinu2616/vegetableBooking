import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Heart, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/vegetables/${id}`);
                setProduct(data);
            } catch (error) {
                toast.error('Failed to load product details');
                navigate('/shop');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (product.stock < quantity) {
            toast.error('Not enough stock available');
            return;
        }
        // Normalize product for cart (cart expects image property usually)
        const cartItem = {
            ...product,
            image: product.image || (product.images && product.images.length > 0 ? product.images[0] : '')
        };
        addToCart(cartItem, quantity);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!product) return null;

    // Handle legacy image vs new images array
    // Ensure we have at least one valid image URL, or use placeholder
    const getValidImages = () => {
        if (product.images && product.images.length > 0) return product.images;
        if (product.image) return [product.image];
        return ['https://placehold.co/400x300?text=No+Image'];
    };
    const images = getValidImages();

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Shop
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div
                        className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative group cursor-zoom-in"
                        onClick={() => setIsExpanded(true)}
                    >
                        <img
                            src={images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=No+Image'; }}
                        />
                        {product.isOrganic && (
                            <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                ORGANIC
                            </span>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white font-medium">
                            Click to Expand
                        </div>
                    </div>
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-primary-600 font-semibold uppercase tracking-wider mb-2">{product.category}</p>
                            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                                <Heart className="w-6 h-6" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors">
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center text-yellow-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="ml-1 font-bold text-gray-900">{product.rating || 5}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">{product.numReviews} reviews</span>
                        <span className="text-gray-300">|</span>
                        <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                            {product.stock > 0 ? `In Stock (${product.stock} kg)` : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Short Description */}
                    {product.shortDescription && (
                        <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 mb-6">
                            <p className="text-primary-800 font-medium">
                                {product.shortDescription}
                            </p>
                        </div>
                    )}

                    {/* Long Description */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl mb-8">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Price per {product.packSize || 1} {product.unit}</p>
                            <p className="text-3xl font-bold text-gray-900">₹{product.price}</p>
                        </div>
                        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex-1 bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Image Modal */}
            {isExpanded && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setIsExpanded(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                        onClick={() => setIsExpanded(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={images[selectedImage]}
                        alt={product.name}
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
