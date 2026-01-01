import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';

const SearchFilter = ({ filters, setFilters, categories }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCategoryChange = (category) => {
        setFilters(prev => ({ ...prev, category }));
    };

    const handleSortChange = (e) => {
        setFilters(prev => ({ ...prev, sort: e.target.value }));
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, keyword: e.target.value }));
    };

    const toggleMobileFilter = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6 flex space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search fresh vegetables..."
                        value={filters.keyword}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    />
                </div>
                <button
                    onClick={toggleMobileFilter}
                    className="bg-white p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary-600 shadow-sm"
                >
                    <Filter className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0 transition duration-300 ease-in-out z-40
                bg-white lg:bg-transparent w-72 lg:w-full h-full lg:h-auto overflow-y-auto lg:overflow-visible
                p-6 lg:p-0 shadow-2xl lg:shadow-none
            `}>
                <div className="flex justify-between items-center lg:hidden mb-6">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Filters</h2>
                    <button onClick={toggleMobileFilter} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Search (Desktop) */}
                    <div className="hidden lg:block relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={filters.keyword}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm bg-white"
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                            Categories
                        </h3>
                        <div className="space-y-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>{cat}</span>
                                    {filters.category === cat && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter (Price & Sort) */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
                        <div className="relative">
                            <select
                                value={filters.sort}
                                onChange={handleSortChange}
                                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-primary-500 text-sm cursor-pointer"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="oldest">Date: Oldest to Newest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <button
                        onClick={() => setFilters({ keyword: '', category: 'All', sort: 'oldest' })}
                        className="w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors border border-dashed border-gray-300 rounded-lg hover:border-red-300"
                    >
                        Reset All Filters
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={toggleMobileFilter}
                />
            )}
        </>
    );
};

export default SearchFilter;
