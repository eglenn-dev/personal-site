import ContactForm from "@/components/contact-form";

export default function ContactPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Contact Me</h1>
            <p className="mb-8">
                I&#39;m always open to new opportunities and collaborations.
                Feel free to reach out!
            </p>
            <ContactForm />
        </div>
    );
}
