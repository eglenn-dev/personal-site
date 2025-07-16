import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1
                className="mt-8 mb-4 text-4xl font-bold leading-10"
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2
                className="mt-6 mb-3 text-3xl font-semibold leading-9"
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3
                className="mt-5 mb-2 text-2xl font-medium leading-8"
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4
                className="mt-4 mb-2 text-xl font-medium leading-7"
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h4>
        ),
        h5: ({ children }) => (
            <h5
                className="mt-3 mb-2 text-lg font-medium leading-6"
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h5>
        ),
        h6: ({ children }) => (
            <h6
                className="mt-2 mb-2 text-base font-medium leading-6"
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h6>
        ),
        p: ({ children }) => (
            <p className="mb-5 text-base leading-7">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="mb-4 list-disc pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="mb-7 list-decimal pl-5">{children}</ol>
        ),
        li: ({ children }) => (
            <li className="mb-2 text-base leading-7">{children}</li>
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
                        className="text-blue-500 underline dark:text-blue-400"
                    >
                        {children}
                    </a>
                );
            } else if ((href && href.startsWith("/")) || href.startsWith("#")) {
                return (
                    <Link
                        href={href}
                        className="text-blue-500 underline dark:text-blue-400"
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
            <hr className="my-6 border-t border-gray-300 dark:border-gray-700" />
        ),
        pre: ({ children }) => (
            <pre className="mb-4 rounded-md border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900">
                {children}
            </pre>
        ),
        code: ({ children }) => (
            <code className="inline-flex max-w-full overflow-x-auto pb-1">
                {children}
            </code>
        ),
        blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-gray-300 pl-4 italic text-gray-700 dark:border-gray-600 dark:text-gray-400">
                {children}
            </blockquote>
        ),
        ...components,
    };
}
