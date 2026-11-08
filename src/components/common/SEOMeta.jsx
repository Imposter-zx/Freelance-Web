import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../context/LanguageContext';

const SITE_NAME = 'ZORD Freelance';
const DEFAULT_DESCRIPTION =
    'Trouvez les meilleurs freelances ou décrochez vos prochains projets sur ZORD.';

const SEOMeta = ({ title, description, keywords, ogImage, noIndex = false }) => {
    const { language } = useLanguage();
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESCRIPTION;
    const canonical =
        typeof window !== 'undefined'
            ? window.location.href.split(/[?#]/)[0]
            : undefined;
    const image =
        ogImage ||
        'https://imposter-zx.github.io/Freelance-Web/assets/Projet1.jpg';

    return (
        <Helmet>
            <html lang={language} />
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            {keywords && <meta name="keywords" content={keywords} />}
            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:image" content={image} />
            <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : language} />
            {canonical && <meta property="og:url" content={canonical} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEOMeta;
