import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const SITE_NAME = 'ZORD Freelance';
const DEFAULT_DESCRIPTION =
    'Trouvez les meilleurs freelances ou décrochez vos prochains projets sur ZORD.';

const upsertMeta = (attribute, key, content) => {
    const selector = `meta[${attribute}="${key}"]`;
    const tags = [...document.head.querySelectorAll(selector)];
    const tag = tags.shift() || document.createElement('meta');

    if (!tag.parentNode) {
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
    tags.forEach((duplicate) => duplicate.remove());
};

const removeMeta = (attribute, key) => {
    document.head.querySelectorAll(`meta[${attribute}="${key}"]`).forEach((tag) => tag.remove());
};

const setCanonical = (href) => {
    if (!href) return;
    const links = [...document.head.querySelectorAll('link[rel="canonical"]')];
    const link = links.shift() || document.createElement('link');

    if (!link.parentNode) {
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', href);
    links.forEach((duplicate) => duplicate.remove());
};

const SEOMeta = ({ title, description, keywords, ogImage, noIndex = false }) => {
    const { language } = useLanguage();
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESCRIPTION;
    const canonical =
        typeof window !== 'undefined' ? window.location.href.split(/[?#]/)[0] : undefined;
    const image =
        ogImage || 'https://imposter-zx.github.io/Freelance-Web/assets/Projet1.jpg';

    useEffect(() => {
        document.title = fullTitle;
        document.documentElement.lang = language;

        // Remove any extra title nodes left by the initial HTML shell.
        const titles = [...document.head.querySelectorAll('title')];
        titles.slice(1).forEach((duplicate) => duplicate.remove());

        upsertMeta('name', 'description', desc);
        if (keywords) {
            upsertMeta('name', 'keywords', keywords);
        } else {
            removeMeta('name', 'keywords');
        }
        upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

        setCanonical(canonical);

        upsertMeta('property', 'og:title', fullTitle);
        upsertMeta('property', 'og:description', desc);
        upsertMeta('property', 'og:type', 'website');
        upsertMeta('property', 'og:site_name', SITE_NAME);
        upsertMeta('property', 'og:image', image);
        upsertMeta('property', 'og:locale', language === 'fr' ? 'fr_FR' : language);
        if (canonical) upsertMeta('property', 'og:url', canonical);

        upsertMeta('name', 'twitter:card', 'summary_large_image');
        upsertMeta('name', 'twitter:title', fullTitle);
        upsertMeta('name', 'twitter:description', desc);
        upsertMeta('name', 'twitter:image', image);
    }, [fullTitle, desc, canonical, image, language, keywords, noIndex]);

    return null;
};

export default SEOMeta;
