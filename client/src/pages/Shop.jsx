import React, { useState, useEffect } from 'react';
import api from '../services/api';
import VegetableCard from '../components/vegetables/VegetableCard';
import SearchFilter from '../components/vegetables/SearchFilter';
import { Loader2, Sprout } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const Shop = () => {
    const [vegetables, setVegetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        keyword: '',
        category: 'All',
        sort: 'oldest'
    });
    const [parent] = useAutoAnimate();

    const categories = ['All', 'Leafy', 'Root', 'Fruit', 'Squash', 'Fungi', 'Vegetable', 'Other'];

    useEffect(() => {
        const fetchVegetables = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.keyword) params.append('keyword', filters.keyword);
                if (filters.category !== 'All') params.append('category', filters.category);
                if (filters.sort) params.append('sort', filters.sort);

                const { data } = await api.get(`/api/vegetables?${params}`);
                setVegetables(data);
            } catch (error) {
                console.error("Failed to fetch vegetables", error);
                // Could verify if seed needed here
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchVegetables();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    return (
        <div className="container mx-auto">
            {/* Page Header */}
            <div className="mb-8 md:mb-12 text-center">
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                    Our <span className="text-primary-600">Fresh</span> Harvest
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Browse our daily selection of premium, organic vegetables sourced directly from local farmers.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="lg:w-1/4 flex-shrink-0">
                    <div className="sticky top-24">
                        <SearchFilter
                            filters={filters}
                            setFilters={setFilters}
                            categories={categories}
                        />
                    </div>
                </aside>

                {/* Main Grid */}
                <main className="lg:w-3/4 min-h-[500px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                        </div>
                    ) : vegetables.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Sprout className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No vegetables found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={() => setFilters({ keyword: '', category: 'All', sort: 'oldest' })}
                                className="mt-6 text-primary-600 font-medium hover:text-primary-700 hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div ref={parent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vegetables.map((vegetable) => (
                                <VegetableCard key={vegetable._id} vegetable={vegetable} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
