import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMessages } from '../context/MessageContext';
import { Send, Search, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
import SEOMeta from '../components/common/SEOMeta';
import MessagePreview from '../components/pretext/MessagePreview';
import MessageBubble from '../components/pretext/MessageBubble';

const Messages = () => {
    const {
        conversations,
        activeConversation,
        setActiveConversation,
        sendMessage,
        markAsRead,
        getConversationMessages
    } = useMessages();

    const [messageText, setMessageText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const filteredConversations = conversations.filter(c =>
        c.participantName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentMessages = activeConversation 
        ? getConversationMessages(activeConversation.id) 
        : [];

    useEffect(() => {
        if (activeConversation) {
            markAsRead(activeConversation.id);
        }
    }, [activeConversation?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (messageText.trim() && activeConversation) {
            sendMessage(activeConversation.id, messageText);
            setMessageText('');
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Aujourd hui';
        if (date.toDateString() === yesterday.toDateString()) return 'Hier';
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const groupedMessages = currentMessages.reduce((acc, msg) => {
        const date = formatDate(msg.timestamp);
        if (!acc[date]) acc[date] = [];
        acc[date].push(msg);
        return acc;
    }, {});

    return (
        <div className="min-h-screen pt-24 pb-8 bg-bg-soft">
            <SEOMeta title="Messages" description="Gerez vos conversations avec les freelances." />

            <div className="container">
                <div className="bg-bg-main rounded-3xl border border-border shadow-sm overflow-hidden h-[calc(100vh-140px)] flex">
                    <div className={`${activeConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 border-r border-border`}>
                        <div className="p-6 border-b border-border">
                            <h1 className="text-2xl font-bold font-outfit mb-4">Messages</h1>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
                                <input
                                    type="text"
                                    placeholder="Rechercher une conversation..."
                                    className="w-full pl-10 pr-4 py-3 bg-bg-soft border border-border rounded-xl text-sm focus:border-blue-500 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.map((conv) => (
                                <motion.button
                                    key={conv.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => setActiveConversation(conv)}
                                    className={`w-full p-4 flex items-center gap-4 hover:bg-bg-soft transition-colors text-left border-b border-border ${
                                        activeConversation?.id === conv.id ? 'bg-bg-soft' : ''
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                                        {conv.photo ? (
                                            <img src={conv.photo} alt={conv.participantName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center w-full h-full text-blue-600 font-bold">{conv.participantAvatar}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-sm truncate">{conv.participantName}</span>
                                            <span className="text-xs text-text-soft">{formatTime(conv.timestamp)}</span>
                                        </div>
                                        <MessagePreview 
                                            text={conv.lastMessage || 'Nouvelle conversation'} 
                                            maxWidth={200}
                                            maxLines={1}
                                        />
                                    </div>
                                    {conv.unread > 0 && (
                                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            {conv.unread}
                                        </span>
                                    )}
                                </motion.button>
                            ))}

                            {filteredConversations.length === 0 && (
                                <div className="p-8 text-center text-text-soft">
                                    <p>Aucune conversation trouvee</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {activeConversation ? (
                        <div className="flex-1 flex flex-col">
                            <div className="p-4 border-b border-border flex items-center justify-between bg-bg-main">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setActiveConversation(null)}
                                        className="md:hidden p-2 hover:bg-bg-soft rounded-lg"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        {activeConversation.participantAvatar}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{activeConversation.participantName}</h3>
                                        <span className="text-xs text-green-500">En ligne</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-bg-soft rounded-lg">
                                        <Phone size={20} className="text-text-soft" />
                                    </button>
                                    <button className="p-2 hover:bg-bg-soft rounded-lg">
                                        <Video size={20} className="text-text-soft" />
                                    </button>
                                    <button className="p-2 hover:bg-bg-soft rounded-lg">
                                        <MoreVertical size={20} className="text-text-soft" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {Object.entries(groupedMessages).map(([date, msgs]) => (
                                    <div key={date}>
                                        <div className="flex justify-center mb-4">
                                            <span className="text-xs text-text-soft bg-bg-soft px-3 py-1 rounded-full">{date}</span>
                                        </div>
                                        {msgs.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex mb-4 ${msg.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <MessageBubble 
                                                    text={msg.text}
                                                    isUser={msg.senderId === 'user'}
                                                    timestamp={msg.timestamp}
                                                    maxWidth={280}
                                                    className={msg.senderId === 'user' ? 'order-2' : 'order-1'}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSend} className="p-4 border-t border-border bg-bg-main">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Tapez votre message..."
                                        className="flex-1 px-5 py-3 bg-bg-soft border border-border rounded-full focus:border-blue-500 outline-none"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageText.trim()}
                                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="hidden md:flex flex-1 items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-bg-soft rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send size={32} className="text-text-soft" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Vos Messages</h3>
                                <p className="text-text-soft text-sm">Selectionnez une conversation pour commencer a discuter</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
