import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

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
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
            <h1 className="mb-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                Contact
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
                Get in touch for new opportunities and collaborations.
            </p>
            <div className="glass rounded-[32px] p-6 sm:p-8">
                <ContactForm />
            </div>
        </div>
    );
}
