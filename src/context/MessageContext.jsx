import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('conversations');
        if (stored) {
            setConversations(JSON.parse(stored));
        } else {
            const initialConversations = [
                {
                    id: 1,
                    participantId: 1,
                    participantName: "Jean Dupont",
                    participantAvatar: "JD",
                    lastMessage: "Bonjour, je suis interesse par votre projet",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    unread: 2
                },
                {
                    id: 2,
                    participantId: 2,
                    participantName: "Sophie Martin",
                    participantAvatar: "SM",
                    lastMessage: "J'ai termine la premiere version du design",
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    unread: 0
                }
            ];
            setConversations(initialConversations);
            localStorage.setItem('conversations', JSON.stringify(initialConversations));
        }

        const storedMessages = localStorage.getItem('messages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        } else {
            const initialMessages = [
                { id: 1, conversationId: 1, senderId: 'freelancer', text: "Bonjour, je suis interesse par votre projet", timestamp: new Date(Date.now() - 3600000).toISOString() },
                { id: 2, conversationId: 1, senderId: 'user', text: "Excellent ! Pouvez-vous me parler de votre experience ?", timestamp: new Date(Date.now() - 3500000).toISOString() },
                { id: 3, conversationId: 1, senderId: 'freelancer', text: "J'ai 8 ans d'experience en developpement web", timestamp: new Date(Date.now() - 3400000).toISOString() },
                { id: 4, conversationId: 2, senderId: 'freelancer', text: "J'ai termine la premiere version du design", timestamp: new Date(Date.now() - 86400000).toISOString() },
            ];
            setMessages(initialMessages);
            localStorage.setItem('messages', JSON.stringify(initialMessages));
        }
    }, []);

    useEffect(() => {
        const totalUnread = conversations.reduce((acc, conv) => acc + conv.unread, 0);
        setUnreadCount(totalUnread);
    }, [conversations]);

    const sendMessage = (conversationId, text) => {
        const newMessage = {
            id: Date.now(),
            conversationId,
            senderId: 'user',
            text,
            timestamp: new Date().toISOString()
        };
        
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        localStorage.setItem('messages', JSON.stringify(updatedMessages));

        const updatedConversations = conversations.map(conv => 
            conv.id === conversationId 
                ? { ...conv, lastMessage: text, timestamp: newMessage.timestamp }
                : conv
        );
        setConversations(updatedConversations);
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    };

    const startConversation = (participant) => {
        const existing = conversations.find(c => c.participantId === participant.id);
        if (existing) {
            setActiveConversation(existing);
            return existing;
        }

        const newConversation = {
            id: Date.now(),
            participantId: participant.id,
            participantName: participant.name,
            participantAvatar: participant.name.split(' ').map(n => n[0]).join(''),
            lastMessage: '',
            timestamp: new Date().toISOString(),
            unread: 0
        };

        const updatedConversations = [newConversation, ...conversations];
        setConversations(updatedConversations);
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        
        setActiveConversation(newConversation);
        return newConversation;
    };

    const markAsRead = (conversationId) => {
        const updatedConversations = conversations.map(conv =>
            conv.id === conversationId ? { ...conv, unread: 0 } : conv
        );
        setConversations(updatedConversations);
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    };

    const getConversationMessages = (conversationId) => {
        return messages.filter(m => m.conversationId === conversationId);
    };

    return (
        <MessageContext.Provider value={{
            conversations,
            activeConversation,
            setActiveConversation,
            messages,
            sendMessage,
            startConversation,
            markAsRead,
            getConversationMessages,
            unreadCount
        }}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) throw new Error('useMessages must be used within a MessageProvider');
    return context;
};
