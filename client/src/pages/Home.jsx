import React from 'react';

<section className="relative overflow-hidden bg-gray-900 text-white rounded-3xl shadow-2xl">
    {/* Decorative Background Elements */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-600/20 rounded-full blur-3xl"></div>
    </div>

    <div className="relative z-10 container mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">

        {/* Hero Image - High Definition & Prominent */}
        <div className="w-full max-w-3xl mb-12 transform hover:scale-105 transition-transform duration-700 ease-in-out">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                    src="/vegetable.png"
                    alt="Fresh Vegetables"
                    className="relative rounded-2xl shadow-2xl w-full object-cover max-h-[500px] border border-gray-800"
                />
            </div>
        </div>

        {/* Text Section - Below Image */}
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="space-y-4">
                <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-semibold tracking-wider text-sm uppercase">
                    100% Organic & Fresh
                </span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 leading-tight">
                    Farm Fresh Vegetables <br />
                    <span className="text-green-500">Delivered to Your Door</span>
                </h1>
            </div>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Taste the difference of locally sourced, pesticide-free produce.
                We bring the farm directly to your kitchen for a healthier lifestyle.
            </p>

            <div className="pt-4">
                <button className="px-10 py-5 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-full shadow-lg shadow-green-900/50 hover:shadow-green-500/30 transform hover:-translate-y-1 transition-all duration-300 ring-2 ring-white/10">
                    Start Shopping Now
                </button>
            </div>
        </div>
    </div>
</section>

export default Home;
