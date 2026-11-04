import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { isValidElement, type ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { headingId } from "@/lib/utils";

function getTextContent(node: ReactNode): string {
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(getTextContent).join("");
    }
    if (isValidElement<{ children?: ReactNode }>(node)) {
        return getTextContent(node.props.children);
    }
    return "";
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1
                className="mt-10 mb-4 text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] scroll-mt-24"
                id={headingId(getTextContent(children))}
            >
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2
                className="mt-12 mb-3 text-3xl font-bold leading-9 tracking-tight scroll-mt-24"
                id={headingId(getTextContent(children))}
            >
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3
                className="mt-8 mb-2 text-2xl font-bold leading-8 tracking-tight scroll-mt-24"
                id={headingId(getTextContent(children))}
            >
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4
                className="mt-4 mb-2 font-display text-xl font-semibold leading-7 text-primary scroll-mt-24"
                id={headingId(getTextContent(children))}
            >
                {children}
            </h4>
        ),
        h5: ({ children }) => (
            <h5
                className="mt-3 mb-2 font-display text-lg font-semibold leading-6 text-primary scroll-mt-24"
                id={headingId(getTextContent(children))}
            >
                {children}
            </h5>
        ),
        h6: ({ children }) => (
            <h6
                className="mt-2 mb-2 font-display text-base font-semibold leading-6 text-primary scroll-mt-24"
                id={headingId(getTextContent(children))}
            >
                {children}
            </h6>
        ),
        p: ({ children }) => (
            <p className="mb-5 mt-4 text-base leading-7">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="mb-2 list-disc pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="mb-0.5 list-decimal pl-5">{children}</ol>
        ),
        li: ({ children }) => (
            <li className="mb-0.5 text-base leading-7">{children}</li>
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
                        className="font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
                    >
                        {children}
                    </a>
                );
            } else if ((href && href.startsWith("/")) || href.startsWith("#")) {
                return (
                    <Link
                        href={href}
                        className="font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
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
                className="h-auto w-full"
                {...(props as ImageProps)}
                alt={props.alt || "Image"}
            />
        ),
        hr: () => (
            <hr className="my-10 border-t border-border" />
        ),
        pre: (props) => <CodeBlock {...props} />,
        code: ({ children }) => (
            <code className="inline-flex max-w-full overflow-x-auto rounded-md border bg-muted/60 px-1.5 py-0.5 font-mono text-[0.85em]">
                {children}
            </code>
        ),
        blockquote: ({ children }) => (
            <blockquote className="my-6 rounded-r-lg border-l-4 border-brand bg-muted/40 py-1 pl-4 pr-3 text-foreground/80">
                {children}
            </blockquote>
        ),
        ...components,
    };
}
