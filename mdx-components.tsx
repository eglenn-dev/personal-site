import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

function generateID(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1
                className="font-display text-5xl md:text-6xl tracking-tight leading-[1.02] mt-12 mb-6"
                id={generateID(children?.toString() || "")}
            >
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2
                className="font-display text-3xl md:text-4xl tracking-tight leading-[1.1] mt-12 mb-4"
                id={generateID(children?.toString() || "")}
            >
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3
                className="font-display text-2xl md:text-3xl tracking-tight leading-[1.15] mt-8 mb-3"
                id={generateID(children?.toString() || "")}
            >
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4
                className="font-display text-xl md:text-2xl tracking-tight leading-tight mt-6 mb-2"
                id={generateID(children?.toString() || "")}
            >
                {children}
            </h4>
        ),
        h5: ({ children }) => (
            <h5
                className="font-display text-lg md:text-xl tracking-tight mt-4 mb-2"
                id={generateID(children?.toString() || "")}
            >
                {children}
            </h5>
        ),
        h6: ({ children }) => (
            <h6
                className="font-semibold text-base mt-3 mb-2"
                id={generateID(children?.toString() || "")}
            >
                {children}
            </h6>
        ),
        p: ({ children }) => (
            <p className="mb-5 mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
                {children}
            </p>
        ),
        ul: ({ children }) => (
            <ul className="mb-6 list-disc pl-5 space-y-2 text-muted-foreground marker:text-lime">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="mb-6 list-decimal pl-5 space-y-2 text-muted-foreground marker:text-lime marker:font-semibold">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="text-base md:text-lg leading-relaxed">{children}</li>
        ),
        a: ({ children, href }) => {
            if (
                href &&
                (href.startsWith("http") ||
                    href.startsWith("https") ||
                    href.startsWith("mailto") ||
                    href.startsWith("www"))
            ) {
                return (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime underline underline-offset-4 decoration-lime/50 hover:decoration-lime transition-colors"
                    >
                        {children}
                    </a>
                );
            } else if ((href && href.startsWith("/")) || href.startsWith("#")) {
                return (
                    <Link
                        href={href}
                        className="text-lime underline underline-offset-4 decoration-lime/50 hover:decoration-lime transition-colors"
                        target={href.includes("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                    >
                        {children}
                    </Link>
                );
            } else {
                return <span></span>;
            }
        },
        img: (props) => (
            <Image
                sizes="100vw"
                className="h-auto w-full rounded-2xl my-8 border border-border/40"
                {...(props as ImageProps)}
                alt={props.alt || "Image"}
            />
        ),
        hr: () => <hr className="my-10 border-t border-border" />,
        pre: (props) => <CodeBlock {...props} />,
        code: ({ children }) => (
            <code className="inline-flex max-w-full overflow-x-auto rounded-md bg-surface-2 border border-border/40 px-1.5 py-0.5 text-sm text-lime">
                {children}
            </code>
        ),
        blockquote: ({ children }) => (
            <blockquote className="my-8 border-l-2 border-lime pl-6 text-foreground/80 text-lg md:text-xl leading-relaxed">
                {children}
            </blockquote>
        ),
        ...components,
    };
}
