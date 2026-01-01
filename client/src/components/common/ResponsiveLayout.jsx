import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const ResponsiveLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-neutral-50">
            <Toaster
                position="top-center"
                toastOptions={{
                    className: '',
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '10px',
                    },
                    success: {
                        style: {
                            background: '#22c55e',
                        },
                    },
                    error: {
                        style: {
                            background: '#ef4444',
                        },
                    },
                }}
            />
            <Header />
            <main className="flex-grow pt-24 pb-12 px-4 md:px-6 container mx-auto">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default ResponsiveLayout;
