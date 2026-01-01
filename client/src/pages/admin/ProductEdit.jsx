import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        shortDescription: '',
        category: 'Leafy',
        stock: '',
        unit: 'kg',
        packSize: '',
        isOrganic: false
    });
    const [imageUrls, setImageUrls] = useState(['', '', '', '']);

    const categories = ['Leafy', 'Root', 'Fruit', 'Squash', 'Fungi', 'Vegetable', 'Other'];

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await api.get(`/api/vegetables/${id}`);
                    setFormData({
                        name: data.name,
                        price: data.price,
                        description: data.description,
                        shortDescription: data.shortDescription,
                        category: data.category,
                        stock: data.stock,
                        unit: data.unit,
                        packSize: data.packSize,
                        isOrganic: data.isOrganic
                    });

                    // Fill image URLs
                    const currentImages = data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []);
                    const newUrls = ['', '', '', ''];
                    currentImages.slice(0, 4).forEach((url, index) => {
                        newUrls[index] = url;
                    });
                    setImageUrls(newUrls);

                } catch (error) {
                    toast.error('Failed to fetch product details');
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleUrlChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Filter out empty strings
            const validImages = imageUrls.filter(url => url.trim() !== '');

            if (validImages.length === 0) {
                toast.error('Please add at least one image URL');
                return;
            }

            const payload = {
                ...formData,
                images: validImages
            };

            if (isEditMode) {
                await api.put(`/api/vegetables/${id}`, payload);
                toast.success('Product updated');
            } else {
                await api.post('/api/vegetables', payload);
                toast.success('Product created');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    name="packSize"
                                    value={formData.packSize || ''}
                                    onChange={handleChange}
                                    required
                                    placeholder="Qty"
                                    step="0.01"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none bg-white"
                                >
                                    {['kg', 'g', 'pieces'].map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none bg-white"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Product Image URLs (Max 4)</label>
                        <p className="text-xs text-gray-500 mb-2">Paste direct image links (e.g., ending in .jpg, .png)</p>

                        {imageUrls.map((url, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <input
                                        type="url"
                                        placeholder={`Image URL ${index + 1} ${index === 0 ? '(Primary)' : ''}`}
                                        value={url}
                                        onChange={(e) => handleUrlChange(index, e.target.value)}
                                        required={index === 0}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm"
                                    />
                                </div>
                                {url && (
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                        <img
                                            src={url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                            onLoad={(e) => { e.target.style.display = 'block' }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (Summary)</label>
                        <input
                            type="text"
                            name="shortDescription"
                            value={formData.shortDescription || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none mb-4"
                            placeholder="Brief summary for the shop card..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Long Description (Detailed)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                        ></textarea>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isOrganic"
                            id="isOrganic"
                            checked={formData.isOrganic}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                        />
                        <label htmlFor="isOrganic" className="text-gray-900 font-medium">Is Organic?</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEdit;
