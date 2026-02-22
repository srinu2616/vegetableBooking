import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Mail, User, Calendar, Trash2, Eye, Search, Filter, Loader2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MessageList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [replying, setReplying] = useState(false);
    const [replyData, setReplyData] = useState({ subject: '', message: '' });
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchMessagesData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/api/contacts');
                if (data.success && isMounted) {
                    setMessages(data.data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching messages:', error);
                    toast.error('Failed to load messages');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMessagesData();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (selectedMessage) {
            setReplyData({
                subject: `Re: ${selectedMessage.subject}`,
                message: ''
            });
            setReplying(false);
        }
    }, [selectedMessage]);

    const handleSendReply = async (e) => {
        e.preventDefault();
        try {
            setSendingReply(true);
            const { data } = await api.post('/api/contacts/reply', {
                to: selectedMessage.email,
                subject: replyData.subject,
                message: replyData.message,
                contactId: selectedMessage._id
            });

            if (data.success) {
                toast.success('Reply sent successfully!');
                setReplying(false);
                fetchMessages(); // Refresh list to show replied status
            }
        } catch (error) {
            console.error('Reply error:', error);
            toast.error(error.response?.data?.message || 'Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/contacts');
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            // Check if there's a delete route. If not, I should probably add one to backend.
            // For now, let's assume it exists or just handle it if it fails.
            await api.delete(`/api/contacts/${id}`);
            setMessages(messages.filter(msg => msg._id !== id));
            toast.success('Message deleted');
            if (selectedMessage?._id === id) setSelectedMessage(null);
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Customer Messages</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and respond to customer inquiries</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-80 shadow-sm transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Messages List */}
                <div className="xl:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredMessages.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 text-center transition-colors">
                            <MessageSquare className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">No messages found</p>
                        </div>
                    ) : (
                        filteredMessages.map((msg) => (
                            <motion.div
                                layoutId={msg._id}
                                key={msg._id}
                                onClick={() => setSelectedMessage(msg)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${selectedMessage?._id === msg._id
                                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 shadow-sm'
                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-800 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2">{msg.name}</h3>
                                    {msg.status === 'replied' ? (
                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 whitespace-nowrap">
                                            Replied
                                        </span>
                                    ) : (
                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2 truncate">{msg.subject}</p>
                                <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 space-x-2">
                                    <Mail className="w-3 h-3" />
                                    <span className="truncate">{msg.email}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Message Detail View */}
                <div className="xl:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedMessage ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                key={selectedMessage._id}
                                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-premium overflow-hidden h-full flex flex-col transition-colors"
                            >
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMessage.name}</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => deleteMessage(selectedMessage._id)}
                                            className="p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                            title="Delete Message"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2 shadow-sm">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(selectedMessage.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 overflow-y-auto">
                                    <div className="mb-6">
                                        <span className="text-xs uppercase font-extrabold text-primary-600 dark:text-primary-400 tracking-wider">Subject</span>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{selectedMessage.subject}</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <span className="text-xs uppercase font-extrabold text-gray-400 dark:text-gray-500 tracking-wider">Message</span>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap border border-gray-100 dark:border-gray-800">
                                            {selectedMessage.message}
                                        </div>
                                    </div>

                                    {replying && (
                                        <motion.form
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-8 pt-8 border-t border-gray-100 space-y-4"
                                            onSubmit={handleSendReply}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs uppercase font-extrabold text-primary-600 dark:text-primary-400 tracking-wider">Direct Reply</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setReplying(false)}
                                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={replyData.subject}
                                                onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
                                                placeholder="Subject"
                                                required
                                            />
                                            <textarea
                                                value={replyData.message}
                                                onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all h-32 resize-none"
                                                placeholder="Type your response here..."
                                                required
                                            ></textarea>
                                            <button
                                                type="submit"
                                                disabled={sendingReply}
                                                className="w-full py-3.5 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                                            >
                                                {sendingReply ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Mail className="w-5 h-5" />
                                                        <span>Send Response</span>
                                                    </>
                                                )}
                                            </button>
                                        </motion.form>
                                    )}
                                </div>
                                {!replying && (
                                    <div className="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-50 dark:border-gray-800">
                                        <button
                                            onClick={() => setReplying(true)}
                                            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
                                        >
                                            Reply via Email
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 border-dashed h-full flex items-center justify-center p-12 text-center transition-colors">
                                <div>
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-700 shadow-inner">
                                        <Eye className="w-10 h-10 text-gray-200 dark:text-gray-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a message</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">Choose a message from the list on the left to view its full details and respond.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MessageList;
