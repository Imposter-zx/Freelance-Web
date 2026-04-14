import React, { useMemo, useRef, useEffect, useState } from 'react';
import { prepare, layout } from '@chenglou/pretext';

const MessagePreview = ({ 
    text, 
    maxWidth = 200, 
    maxLines = 1, 
    className = '',
    showTruncation = true 
}) => {
    const containerRef = useRef(null);
    const [font, setFont] = useState('12px Inter, system-ui, sans-serif');
    const [lineHeight, setLineHeight] = useState(16);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            const computedStyle = window.getComputedStyle(containerRef.current);
            setFont(`${computedStyle.fontSize} ${computedStyle.fontFamily}`);
            const computedLineHeight = computedStyle.lineHeight;
            setLineHeight(computedLineHeight === 'normal' ? 16 : parseFloat(computedLineHeight) || 16);
            setIsReady(true);
        }
    }, []);

    const measurement = useMemo(() => {
        if (!text || !font || !isReady) return { height: 0, lineCount: 0 };
        try {
            const prepared = prepare(text, font);
            return layout(prepared, maxWidth, lineHeight);
        } catch (e) {
            return { height: 0, lineCount: 0 };
        }
    }, [text, font, maxWidth, lineHeight, isReady]);

    const shouldTruncate = measurement.lineCount > maxLines && showTruncation;
    
    const displayText = useMemo(() => {
        if (!shouldTruncate) return text;
        
        const targetHeight = maxLines * lineHeight;
        const avgCharsPerLine = text.length / Math.max(measurement.lineCount, 1);
        const estimatedChars = Math.floor(avgCharsPerLine * maxLines * 0.85);
        
        return text.slice(0, estimatedChars) + '...';
    }, [text, shouldTruncate, maxLines, lineHeight, measurement.lineCount]);

    return (
        <div ref={containerRef} className={`message-preview ${className}`}>
            <p className="text-xs text-text-soft" title={text}>
                {displayText}
            </p>
        </div>
    );
};

export default MessagePreview;
