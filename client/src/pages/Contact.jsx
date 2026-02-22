import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post('/api/contacts', formData);

            if (response.data.success) {
                toast.success(response.data.message || 'Message sent! We\'ll get back to you soon.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error(response.data.message || 'Failed to send message.');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to send message. Please try again later.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50/50">
            {/* Hero Section */}
            <section className="relative py-20 bg-primary-600 rounded-3xl overflow-hidden mb-16 shadow-premium mx-4 md:mx-6">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1595188448897-42289c9225f6?auto=format&fit=crop&q=80&w=2000"
                        alt="Contact"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-6 text-center text-white">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold mb-4"
                    >
                        Get In Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold mb-6"
                    >
                        We'd Love to Hear From You
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-primary-50 text-lg md:text-xl"
                    >
                        Have a question about our products, delivery, or want to partner with us? Reach out and our team will get back to you shortly.
                    </motion.p>
                </div>
            </section>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 border-b border-primary-100 pb-4">Contact Information</h2>
                            <div className="space-y-8">
                                <div className="flex items-start space-x-6 group">
                                    <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-primary-600 shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                        <MapPinIcon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Our Location</h4>
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            Opposite to Trends, Apsari Road,<br />
                                            J78Q+RMG, RTC Colonly, Adoni, <br />
                                            Andhra Pradesh 518301
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-6 group">
                                    <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-primary-600 shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                        <PhoneIcon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Phone Number</h4>
                                        <p className="text-gray-600 font-medium">+91 9849642616</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-6 group">
                                    <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-primary-600 shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                        <MailIcon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Email Address</h4>
                                        <p className="text-gray-600 font-medium">balayya375@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Map */}
                        <div className="h-96 bg-white p-2 rounded-3xl overflow-hidden shadow-premium border border-gray-100">
                            <iframe
                                src="https://maps.google.com/maps?q=15.617214443500805,77.28922302368953&z=17&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '1.25rem' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="HarvestHub Exact Location"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-premium border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 relative z-10">Send Us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your Name"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your Email"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="How can we help?"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    placeholder="Type your message here..."
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none font-medium"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:transform-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Sending Message...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-6 h-6" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
