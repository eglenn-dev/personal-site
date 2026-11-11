import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import { SOCIAL_LINKS } from "@/lib/site-config";

const otherChannels = [
    { name: "LinkedIn", href: SOCIAL_LINKS.linkedin },
    { name: "X", href: SOCIAL_LINKS.twitter },
    { name: "GitHub", href: SOCIAL_LINKS.github },
];

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Get in touch with me for new opportunities and collaborations",
    openGraph: {
        title: "Contact",
        description:
            "Get in touch with me for new opportunities and collaborations",
        url: "/contact",
        type: "website",
        images: [
            {
                url: "/og?title=Contact&description=Get+in+touch+with+me+for+new+opportunities+and+collaborations",
                width: 1200,
                height: 630,
                alt: "Contact | Ethan Glenn",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact | Ethan Glenn",
        description:
            "Get in touch with me for new opportunities and collaborations",
        images: [
            "/og?title=Contact&description=Get+in+touch+with+me+for+new+opportunities+and+collaborations",
        ],
    },
    alternates: {
        canonical: "/contact",
    },
};

export default function ContactPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-3">Contact</h1>
            <p className="text-lg text-muted-foreground mb-10">
                Get in touch for new opportunities and collaborations.
            </p>
            <ContactForm />
            <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">
                Rather not use a form? Reach me on{" "}
                {otherChannels.map(({ name, href }, index) => (
                    <span key={name}>
                        {index > 0 &&
                            (index === otherChannels.length - 1
                                ? ", or "
                                : ", ")}
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-foreground underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
                        >
                            {name}
                        </a>
                    </span>
                ))}
                .
            </p>
        </div>
    );
}
