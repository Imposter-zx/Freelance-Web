import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MessageSquare, Search, Send } from 'lucide-react';
import { useMessages } from '../context/MessageContext';
import { freelancers } from '../services/mockData';
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
        startConversation,
        getConversationMessages,
    } = useMessages();

    const [searchParams] = useSearchParams();
    const [messageText, setMessageText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const filteredConversations = conversations.filter((conversation) =>
        conversation.participantName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentMessages = activeConversation
        ? getConversationMessages(activeConversation.id)
        : [];

    // Deep link from a freelancer profile: /messages?to=<freelancerId>
    useEffect(() => {
        const participantId = Number(searchParams.get('to'));
        if (!participantId) return;

        const freelancer = freelancers.find((item) => item.id === participantId);
        if (!freelancer) return;

        const existing = conversations.find(
            (conversation) => conversation.participantId === participantId
        );
        if (existing) {
            setActiveConversation(existing);
            return;
        }
        startConversation(freelancer);
    }, [searchParams, conversations, setActiveConversation, startConversation]);

    useEffect(() => {
        if (activeConversation) {
            markAsRead(activeConversation.id);
        }
    }, [activeConversation?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [currentMessages.length, activeConversation?.id]);

    const handleSend = (event) => {
        event.preventDefault();
        const text = messageText.trim();
        if (!text || !activeConversation) return;
        sendMessage(activeConversation.id, text);
        setMessageText('');
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

        if (date.toDateString() === today.toDateString()) return 'Aujourd’hui';
        if (date.toDateString() === yesterday.toDateString()) return 'Hier';
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const groupedMessages = currentMessages.reduce((groups, message) => {
        const date = formatDate(message.timestamp);
        if (!groups[date]) groups[date] = [];
        groups[date].push(message);
        return groups;
    }, {});

    const activeProfile = activeConversation
        ? freelancers.find((item) => item.id === activeConversation.participantId)
        : null;

    return (
        <div className="min-h-screen bg-bg-soft pb-8 pt-24 sm:pt-28">
            <SEOMeta title="Messages" description="Gérez vos conversations avec les freelances." noIndex />

            <div className="container">
                <div className="flex h-[calc(100vh-8.5rem)] overflow-hidden rounded-3xl border border-border bg-bg-main shadow-card">
                    {/* Conversation list */}
                    <div
                        className={`${
                            activeConversation ? 'hidden md:flex' : 'flex'
                        } w-full flex-col border-r border-border md:w-80 lg:w-96`}
                    >
                        <div className="border-b border-border p-5">
                            <h1 className="font-display text-xl font-bold">Messages</h1>
                            <p className="mt-1 text-[11px] text-text-soft">
                                Conversations de démonstration
                            </p>
                            <div className="relative mt-4">
                                <label htmlFor="conversation-search" className="sr-only">
                                    Rechercher une conversation
                                </label>
                                <Search
                                    size={17}
                                    aria-hidden="true"
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft"
                                />
                                <input
                                    id="conversation-search"
                                    type="search"
                                    placeholder="Rechercher une conversation…"
                                    className="w-full rounded-xl border border-border bg-bg-soft py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    type="button"
                                    onClick={() => setActiveConversation(conversation)}
                                    className={`flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-bg-soft ${
                                        activeConversation?.id === conversation.id ? 'bg-bg-soft' : ''
                                    }`}
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 font-bold text-blue-700 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300">
                                        {conversation.participantAvatar}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-0.5 flex items-center justify-between gap-2">
                                            <span className="truncate text-sm font-bold">
                                                {conversation.participantName}
                                            </span>
                                            <span className="shrink-0 text-[11px] text-text-soft">
                                                {formatTime(conversation.timestamp)}
                                            </span>
                                        </div>
                                        <MessagePreview
                                            text={conversation.lastMessage || 'Nouvelle conversation'}
                                            maxWidth={200}
                                            maxLines={1}
                                        />
                                    </div>
                                    {conversation.unread > 0 && (
                                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">
                                            {conversation.unread}
                                        </span>
                                    )}
                                </button>
                            ))}

                            {filteredConversations.length === 0 && (
                                <div className="p-8 text-center text-sm text-text-soft">
                                    Aucune conversation trouvée.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Conversation view */}
                    {activeConversation ? (
                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-center justify-between border-b border-border bg-bg-main p-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveConversation(null)}
                                        className="rounded-lg p-2 hover:bg-bg-soft md:hidden"
                                        aria-label="Revenir aux conversations"
                                    >
                                        <ArrowLeft size={19} aria-hidden="true" />
                                    </button>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 font-bold text-blue-700 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300">
                                        {activeConversation.participantAvatar}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="truncate text-sm font-bold">
                                            {activeConversation.participantName}
                                        </h2>
                                        <span className="text-[11px] text-text-soft">
                                            Conversation de démonstration
                                        </span>
                                    </div>
                                </div>
                                {activeProfile && (
                                    <Link
                                        to={`/profile/${activeProfile.id}`}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-soft transition-colors hover:border-blue-300 hover:text-blue-700"
                                    >
                                        <ExternalLink size={14} aria-hidden="true" />
                                        Profil
                                    </Link>
                                )}
                            </div>

                            <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6" aria-live="polite">
                                {Object.entries(groupedMessages).map(([date, messages]) => (
                                    <div key={date}>
                                        <div className="mb-4 flex justify-center">
                                            <span className="rounded-full bg-bg-soft px-3 py-1 text-[11px] text-text-soft">
                                                {date}
                                            </span>
                                        </div>
                                        {messages.map((message) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`mb-3 flex ${
                                                    message.senderId === 'user'
                                                        ? 'justify-end'
                                                        : 'justify-start'
                                                }`}
                                            >
                                                <MessageBubble
                                                    text={message.text}
                                                    isUser={message.senderId === 'user'}
                                                    timestamp={message.timestamp}
                                                    maxWidth={280}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                ))}
                                {currentMessages.length === 0 && (
                                    <p className="text-center text-sm text-text-soft">
                                        Aucun message. Écrivez le premier.
                                    </p>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form
                                onSubmit={handleSend}
                                className="border-t border-border bg-bg-main p-4"
                            >
                                <div className="flex items-center gap-2">
                                    <label htmlFor="message-input" className="sr-only">
                                        Votre message
                                    </label>
                                    <input
                                        id="message-input"
                                        type="text"
                                        placeholder="Tapez votre message…"
                                        className="flex-1 rounded-full border border-border bg-bg-soft px-5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        value={messageText}
                                        onChange={(event) => setMessageText(event.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageText.trim()}
                                        className="rounded-full bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-label="Envoyer le message"
                                    >
                                        <Send size={18} aria-hidden="true" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="hidden flex-1 items-center justify-center md:flex">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-soft">
                                    <MessageSquare size={28} className="text-text-soft" aria-hidden="true" />
                                </div>
                                <h2 className="font-display text-lg font-bold">Vos messages</h2>
                                <p className="mt-1 max-w-xs text-sm text-text-soft">
                                    Sélectionnez une conversation ou contactez un talent depuis son profil.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
