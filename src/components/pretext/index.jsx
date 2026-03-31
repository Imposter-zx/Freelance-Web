import { prepare, layout, prepareWithSegments, layoutWithLines, walkLineRanges, layoutNextLine, clearCache, setLocale } from '@chenglou/pretext';
import MessageBubble from './MessageBubble';
import MessagePreview from './MessagePreview';
import ProjectDescription from './ProjectDescription';
import { useTextMeasure, measureText } from './TextMeasure';

export const TextEngine = {
    prepare,
    layout,
    prepareWithSegments,
    layoutWithLines,
    walkLineRanges,
    layoutNextLine,
    clearCache,
    setLocale
};

export { 
    prepare,
    layout,
    prepareWithSegments,
    layoutWithLines,
    walkLineRanges,
    layoutNextLine,
    clearCache,
    setLocale
};

export { MessageBubble, MessagePreview, ProjectDescription, useTextMeasure, measureText };
