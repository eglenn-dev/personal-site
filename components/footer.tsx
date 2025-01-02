import { GithubIcon, LinkedInIcon, XIcon } from "@/lib/icons";

export default async function Footer() {
    return (
        <footer className="border-t">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Ethan Glenn. All
                        rights reserved.
                    </p>
                    <div className="flex space-x-6 align-center justify-center">
                        <a
                            href="https://github.com/yourusername"
                            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-md hover:shadow-accent/50 rounded-full p-2"
                        >
                            <span className="sr-only">GitHub</span>
                            <GithubIcon />
                        </a>
                        <a
                            href="https://linkedin.com/in/yourusername"
                            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-md hover:shadow-accent/50 rounded-full p-2"
                        >
                            <span className="sr-only">LinkedIn</span>
                            <LinkedInIcon />
                        </a>
                        <a
                            href="https://twitter.com/yourusername"
                            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-md hover:shadow-accent/50 rounded-full p-2 pt-3"
                        >
                            <span className="sr-only">Twitter</span>
                            <XIcon />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
