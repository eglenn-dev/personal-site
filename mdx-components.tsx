import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1
                style={{
                    fontSize: "2.25rem" /* 36px */,
                    lineHeight: "2.5rem" /* 40px */,
                    fontWeight: "700",
                    marginTop: "2rem" /* 32px */,
                    marginBottom: "1rem" /* 16px */,
                }}
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2
                style={{
                    fontSize: "1.875rem" /* 30px */,
                    lineHeight: "2.25rem" /* 36px */,
                    fontWeight: "600",
                    marginTop: "1.5rem" /* 24px */,
                    marginBottom: "0.75rem" /* 12px */,
                }}
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3
                style={{
                    fontSize: "1.5rem" /* 24px */,
                    lineHeight: "2rem" /* 32px */,
                    fontWeight: "500",
                    marginTop: "1.25rem" /* 20px */,
                    marginBottom: "0.5rem" /* 8px */,
                }}
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4
                style={{
                    fontSize: "1.25rem" /* 20px */,
                    lineHeight: "1.75rem" /* 28px */,
                    fontWeight: "500",
                    marginTop: "1rem" /* 16px */,
                    marginBottom: "0.5rem" /* 8px */,
                }}
                id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
                {children}
            </h4>
        ),
        p: ({ children }) => (
            <p
                style={{
                    marginBottom: "1.5rem" /* 16px */,
                    fontSize: "1rem" /* 16px */,
                    lineHeight: "1.75rem" /* 24px */,
                }}
            >
                {children}
            </p>
        ),
        ul: ({ children }) => (
            <ul
                style={{
                    listStyleType: "disc",
                    paddingLeft: "1.25rem" /* 20px */,
                    marginBottom: "1rem" /* 16px */,
                }}
            >
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol
                style={{
                    listStyleType: "decimal",
                    paddingLeft: "1.25rem" /* 20px */,
                    marginBottom: "1.75rem" /* 16px */,
                }}
            >
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li
                style={{
                    marginBottom: "0.5rem" /* 8px */,
                    fontSize: "1rem" /* 16px */,
                    lineHeight: "1.75rem" /* 24px */,
                }}
            >
                {children}
            </li>
        ),
        a: ({ children, href }) => (
            <a
                href={href}
                style={{
                    color: "#3b82f6" /* blue-500 */,
                    textDecoration: "underline",
                }}
                target={href.includes("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
            >
                {children}
            </a>
        ),
        img: (props) => (
            <Image
                sizes="100vw"
                style={{
                    width: "100%",
                    height: "auto",
                }}
                {...(props as ImageProps)}
                alt={props.alt || "Image"}
            />
        ),
        hr: () => (
            <hr
                style={{
                    border: "0",
                    borderTop: "1px solid #7f8081" /* gray-300 */,
                    margin: "1.5rem 0" /* 24px 0 */,
                }}
            />
        ),
        pre: ({ children }) => (
            <pre className="overflow-x-auto text-black dark:text-white p-4 rounded-lg border border-gray-700 bg-gray-800 dark:bg-gray-900 dark:border-gray-700 mb-4">
                {children}
            </pre>
        ),
        ...components,
    };
}
