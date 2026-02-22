import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Award, Sprout, Heart, Github, Linkedin, ExternalLink } from 'lucide-react';

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const team = [
        {
            name: "Gosi Eranna",
            role: "Owner & Founder",
            image: "/owner.jpg",
            phone: "9849946615",
            email: "balayya375@gmail.com",
            bio: "With a passion for sustainable agriculture and community health, Gosi Eranna founded HarvestHub to bridge the gap between fresh farm produce and your kitchen table. His vision is to make healthy, organic living accessible to everyone in Adoni.",
            isOwner: true
        },
        {
            name: "Kuruva Srinivasulu",
            role: "Full Stack Developer",
            image: "/developer.png",
            phone: "9849642616",
            email: "kuruvas691@gmail.com",
            bio: "A dedicated Full Stack Developer who brought the VegetablesHub vision to life digitally. Srinivasulu specializes in building high-performance, user-centric web applications that solve real-world problems through elegant code.",
            isOwner: false
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-20 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative py-24 bg-primary-600 overflow-hidden mx-4 md:mx-6 rounded-[2.5rem] shadow-premium mb-20">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2000"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-6 text-center text-white">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold mb-6 tracking-wide uppercase"
                    >
                        Our Story
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif font-bold mb-8"
                    >
                        Nurturing Quality, <br className="hidden md:block" /> Delivering Freshness
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-primary-50 text-xl leading-relaxed"
                    >
                        Welcome to VegetablesHub, where we believe every meal should start with the finest, freshest ingredients directly from the heart of our farms.
                    </motion.p>
                </div>
            </section>

            {/* Shop Info Section */}
            <section className="container mx-auto px-6 mb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeIn}>
                        <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">Established with Trust</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                            VegetablesHub started as a small local initiative in Adoni to provide families with high-quality, chemical-free vegetables and fruits. Today, we stand as a symbol of trust and health for hundreds of customers.
                        </p>
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 flex items-start space-x-6">
                            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-xl mb-2">Find Us At</h4>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                    Opposite to Trends, Apsari Road,<br />
                                    J78Q+RMG, RTC Colonly, Adoni, <br />
                                    Andhra Pradesh 518301
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d77.2892552!3d15.6172868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1740209300000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="VegetablesHub Precise Location"
                        ></iframe>
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="container mx-auto px-6 mb-32">
                <div className="text-center mb-16">
                    <motion.h2
                        {...fadeIn}
                        className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Meet the Visionaries
                    </motion.h2>
                    <motion.div
                        {...fadeIn}
                        className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {team.map((member, index) => (
                        <motion.div
                            key={member.name}
                            {...fadeIn}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-soft border border-gray-100 dark:border-gray-800 group hover:shadow-premium dark:hover:shadow-primary-900/10 transition-all duration-500"
                        >
                            <div className="flex flex-col lg:flex-row h-full">
                                <div className="lg:w-2/5 relative overflow-hidden h-96 lg:h-auto bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-3">
                                    <div className="w-full h-full relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className={`w-full h-full transition-transform duration-700 group-hover:scale-105 object-contain`}
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500';
                                            }}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8 text-white">
                                        <div className="flex space-x-4">
                                            <a href={`mailto:${member.email}`} className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/40 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </a>
                                            <a href={`tel:${member.phone}`} className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/40 transition-colors">
                                                <Phone className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="mb-6">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block ${member.isOwner ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' : 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400'}`}>
                                            {member.role}
                                        </span>
                                        <h3 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">{member.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic mb-8">"{member.bio}"</p>
                                    </div>
                                    <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer group/link">
                                            <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover/link:bg-primary-50 dark:group-hover/link:bg-primary-900/20 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{member.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer group/link">
                                            <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover/link:bg-primary-50 dark:group-hover/link:bg-primary-900/20 transition-colors">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">+91 {member.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-gray-900 dark:bg-black py-32 mx-4 md:mx-6 rounded-[3rem] mb-20 text-white text-center">
                <div className="container mx-auto px-6">
                    <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-serif font-bold mb-16">The Values We Live By</motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: Sprout, title: "100% Fresh", text: "Harvested at dawn and delivered with care." },
                            { icon: Heart, title: "Healthy Choice", text: "Organic, chemical-free produce for your family." },
                            { icon: Award, title: "Premium Quality", text: "Selected from the finest crops of South India." }
                        ].map((value, idx) => (
                            <motion.div
                                key={value.title}
                                {...fadeIn}
                                transition={{ delay: idx * 0.2 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-primary-400 mb-6 hover:scale-110 transition-transform duration-300">
                                    <value.icon className="w-10 h-10" />
                                </div>
                                <h4 className="text-2xl font-bold mb-3">{value.title}</h4>
                                <p className="text-gray-400 max-w-xs mx-auto leading-relaxed">{value.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
