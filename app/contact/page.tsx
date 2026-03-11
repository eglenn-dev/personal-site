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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Contact Me</h1>
            <ContactForm />
        </div>
    );
}
