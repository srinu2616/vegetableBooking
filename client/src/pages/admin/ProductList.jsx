import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/api/vegetables');
            setProducts(data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/vegetables/${id}`);
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted');
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Link
                    to="/admin/products/new"
                    className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Product</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group">
                        <div className="relative h-48 bg-gray-50 overflow-hidden">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://placehold.co/400x300?text=No+Image')}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Error'; }}
                            />
                            <div className="absolute top-2 right-2">
                                <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
                                    {product.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 line-clamp-1" title={product.name}>{product.name}</h3>
                                <p className="font-bold text-primary-600">₹{product.price} <span className="text-xs text-gray-500 font-normal">/ {product.packSize} {product.unit}</span></p>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {product.stock} kg in stock
                                </span>
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-gray-50">
                                <Link
                                    to={`/admin/products/${product._id}/edit`}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span>Edit</span>
                                </Link>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
