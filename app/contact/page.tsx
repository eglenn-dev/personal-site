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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-10">
            <section className="rounded-[2rem] bg-surface px-6 sm:px-12 lg:px-20 py-16 md:py-24 max-w-5xl">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
                    Contact
                </p>
                <h1 className="font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] mb-6">
                    Let&apos;s build
                    <br />
                    something good.
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                    Get in touch for new opportunities, collaborations, or just
                    to say hello.
                </p>
            </section>

            <section className="rounded-[2rem] bg-surface p-6 sm:p-10 md:p-14 max-w-3xl">
                <ContactForm />
            </section>
        </div>
    );
}
