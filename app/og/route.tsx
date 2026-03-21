import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { SITE_NAME, JOB_TITLE, CLEAN_SITE_URL } from "@/lib/site-config";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get("title") || SITE_NAME;
    const description = searchParams.get("description") || JOB_TITLE;

    return new ImageResponse(
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "60px 80px",
                backgroundColor: "#0a0a0a",
                backgroundImage:
                    "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: 32,
                        color: "#94a3b8",
                        lineHeight: 1.4,
                        maxWidth: "80%",
                    }}
                >
                    {description}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    bottom: "60px",
                    left: "80px",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#0077b6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#ffffff",
                    }}
                >
                    <img
                        src="https://github.com/eglenn-dev.png"
                        alt="Ethan Glenn"
                    />
                </div>
                <div
                    style={{
                        fontSize: 24,
                        color: "#64748b",
                    }}
                >
                    {CLEAN_SITE_URL}
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
        },
    );
}
