import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOMeta = ({ title, description, keywords, ogImage }) => {
    const siteName = 'ZORD Freelance';
    const fullTitle = `${title} | ${siteName}`;
    const defaultDesc = 'Trouvez les meilleurs freelances ou décrochez vos prochains projets sur ZORD.';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            <meta property="og:type" content="website" />
            {ogImage && <meta property="og:image" content={ogImage} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDesc} />
        </Helmet>
    );
};

export default SEOMeta;
