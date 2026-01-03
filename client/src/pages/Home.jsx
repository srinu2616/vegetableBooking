import React from 'react';

const Home = () => {
    return (
        <div className="space-y-12">
            <section className="relative text-center py-32 rounded-3xl overflow-hidden shadow-2xl">
                {/* Background Image & Overlay */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('/vegetable.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
                </div>

                <div className="relative z-10 px-4">
                    <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-bold tracking-wide shadow-sm mb-6">
                        🌿 Fresh From Farm
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">
                        Organic Goodness <br />
                        <span className="text-primary-400">Delivered To You</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-gray-100 mb-10 drop-shadow font-medium">
                        Experience the taste of nature with our hand-picked, pesticide-free vegetables. Delivered fresh within 24 hours.
                    </p>
                    <button className="bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary-500/50 hover:bg-primary-500 transition-all transform hover:-translate-y-1 ring-2 ring-white/20">
                        Shop Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
