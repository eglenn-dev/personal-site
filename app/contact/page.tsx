import ContactForm from "@/components/contact-form";

export const metadata = {
    title: "Contact | Ethan Glenn",
    description:
        "Get in touch with me for new opportunities and collaborations",
};

export default function ContactPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Contact Me</h1>
            <ContactForm />
        </div>
    );
}
