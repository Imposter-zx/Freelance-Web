import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const MessageBubble = ({ 
    text, 
    maxWidth = 280, 
    isUser = false,
    timestamp,
    className = '',
    animate = true
}) => {
    const containerRef = useRef(null);
    const [font, setFont] = useState('14px Inter, system-ui, sans-serif');
    const [lineHeight, setLineHeight] = useState(20);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            const computedStyle = window.getComputedStyle(containerRef.current);
            setFont(`${computedStyle.fontSize} ${computedStyle.fontFamily}`);
            const computedLineHeight = computedStyle.lineHeight;
            setLineHeight(computedLineHeight === 'normal' ? 20 : parseFloat(computedLineHeight) || 20);
            setIsReady(true);
        }
    }, []);

    const { lines, totalHeight, lineWidths } = useMemo(() => {
        if (!text || !font || !isReady) {
            return { lines: [{ text: text || '' }], totalHeight: lineHeight, lineWidths: [100] };
        }
        try {
            const prepared = prepareWithSegments(text, font);
            const availableWidth = maxWidth - 24;
            const result = layoutWithLines(prepared, availableWidth, lineHeight);
            
            return {
                lines: result.lines,
                totalHeight: result.height,
                lineWidths: result.lines.map(l => l.width)
            };
        } catch (e) {
            return { lines: [{ text }], totalHeight: lineHeight, lineWidths: [100] };
        }
    }, [text, font, maxWidth, lineHeight, isReady]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const bubbleContent = (
        <div 
            ref={containerRef}
            className={`message-bubble ${isUser 
                ? 'bg-blue-600 text-white rounded-br-md' 
                : 'bg-bg-soft border border-border rounded-bl-md'} ${className}`}
            style={{ 
                maxWidth: `${maxWidth}px`,
                padding: '12px 16px',
                borderRadius: '16px',
                minWidth: '80px'
            }}
        >
            <div className="text-sm" style={{ lineHeight: `${lineHeight}px` }}>
                {lines.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-words">
                        {line.text}
                    </div>
                ))}
            </div>
            {timestamp && (
                <div className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-text-soft'}`}>
                    {formatTime(timestamp)}
                </div>
            )}
        </div>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {bubbleContent}
            </motion.div>
        );
    }

    return bubbleContent;
};

export default MessageBubble;
