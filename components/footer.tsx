import { Github, Linkedin, Twitter } from "lucide-react";

export default async function Footer() {
    return (
        <footer className="border-t">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} [Your Name]. All
                        rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a
                            href="https://github.com/yourusername"
                            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-md hover:shadow-accent/50 rounded-full p-2"
                        >
                            <span className="sr-only">GitHub</span>
                            <Github className="h-6 w-6" />
                        </a>
                        <a
                            href="https://linkedin.com/in/yourusername"
                            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-md hover:shadow-accent/50 rounded-full p-2"
                        >
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-6 w-6" />
                        </a>
                        <a
                            href="https://twitter.com/yourusername"
                            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-md hover:shadow-accent/50 rounded-full p-2"
                        >
                            <span className="sr-only">Twitter</span>
                            <Twitter className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
