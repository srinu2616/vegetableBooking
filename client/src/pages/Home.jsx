import React from 'react';

const Home = () => {
    return (
        <div className="space-y-12">
            <section className="text-center py-20 bg-primary-50 rounded-3xl relative overflow-hidden">
                <div className="relative z-10">
                    <span className="inline-block px-4 py-2 bg-white text-primary-700 rounded-full text-sm font-bold tracking-wide shadow-sm mb-6">
                        🌿 Fresh From Farm
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        Organic Goodness <br />
                        <span className="text-primary-600">Delivered To You</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-gray-600 mb-10">
                        Experience the taste of nature with our hand-picked, pesticide-free vegetables. Delivered fresh within 24 hours.
                    </p>
                    <button className="bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary-500/30 hover:bg-primary-700 transition-all transform hover:-translate-y-1">
                        Shop Now
                    </button>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </section>
        </div>
    );
};

export default Home;
