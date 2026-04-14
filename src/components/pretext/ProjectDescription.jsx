import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const ProjectDescription = ({ 
    text, 
    maxLines = 3, 
    lineHeight = 20,
    className = '',
    showExpand = true,
    expanded = false,
    onToggle
}) => {
    const containerRef = useRef(null);
    const [font, setFont] = useState('14px Inter, system-ui, sans-serif');
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            const computedStyle = window.getComputedStyle(containerRef.current);
            setFont(`${computedStyle.fontSize} ${computedStyle.fontFamily}`);
            setIsReady(true);
        }
    }, []);

    const { displayLines, fullLineCount, shouldShowExpand } = useMemo(() => {
        if (!text || !font || !isReady) {
            return { displayLines: [{ text: text || '' }], fullLineCount: 1, shouldShowExpand: false };
        }
        try {
            const prepared = prepareWithSegments(text, font);
            const availableWidth = containerRef.current?.offsetWidth || 300;
            const fullResult = layoutWithLines(prepared, availableWidth, lineHeight);
            
            const needsExpand = fullResult.lineCount > maxLines;
            
            if (!isExpanded && needsExpand) {
                const targetLines = fullResult.lines.slice(0, maxLines);
                if (targetLines.length > 0) {
                    targetLines[targetLines.length - 1] = {
                        ...targetLines[targetLines.length - 1],
                        text: targetLines[targetLines.length - 1].text + '...'
                    };
                }
                return { 
                    displayLines: targetLines, 
                    fullLineCount: fullResult.lineCount, 
                    shouldShowExpand: showExpand 
                };
            }
            
            return { 
                displayLines: fullResult.lines, 
                fullLineCount: fullResult.lineCount, 
                shouldShowExpand: showExpand && needsExpand 
            };
        } catch (e) {
            return { displayLines: [{ text }], fullLineCount: 1, shouldShowExpand: false };
        }
    }, [text, font, maxLines, lineHeight, isExpanded, showExpand, isReady]);

    const handleToggle = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        onToggle?.(newState);
    };

    return (
        <div ref={containerRef} className={`project-description ${className}`}>
            <div className="text-sm text-text-soft leading-relaxed">
                {displayLines.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-words">
                        {line.text}
                    </div>
                ))}
            </div>
            {shouldShowExpand && (
                <motion.button 
                    onClick={handleToggle}
                    className="text-blue-600 text-sm font-medium mt-2 hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                </motion.button>
            )}
        </div>
    );
};

export default ProjectDescription;
