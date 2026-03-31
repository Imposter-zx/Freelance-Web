import { useMemo } from 'react';
import { prepare, layout } from '@chenglou/pretext';

export function useTextMeasure(text, font, lineHeight = 1.5, maxWidth = 300) {
    const prepared = useMemo(() => {
        if (!text || !font) return null;
        return prepare(text, font);
    }, [text, font]);

    const measurement = useMemo(() => {
        if (!prepared) return { height: 0, lineCount: 0 };
        return layout(prepared, maxWidth, lineHeight);
    }, [prepared, maxWidth, lineHeight]);

    return measurement;
}

export function measureText(text, font, lineHeight = 1.5, maxWidth = 300) {
    if (!text || !font) return { height: 0, lineCount: 0 };
    const prepared = prepare(text, font);
    return layout(prepared, maxWidth, lineHeight);
}
