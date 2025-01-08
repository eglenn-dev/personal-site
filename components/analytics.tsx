"use client";
import Script from "next/script";

const Analytics = () => {
    return (
        <div>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-SR3CGYCZ0V"
                async={true}
                strategy="afterInteractive"
            ></Script>
            <Script
                id="google-analytics"
                async={true}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-SR3CGYCZ0V');
                    `,
                }}
            ></Script>
        </div>
    );
};

export default Analytics;
