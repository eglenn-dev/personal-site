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
                        color: "#ece6d8",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: 32,
                        color: "#a49e91",
                        lineHeight: 1.4,
                        maxWidth: "80%",
                    }}
                >
                    {description}
                </div>
            </div>
            <svg
                width="88"
                height="88"
                viewBox="0 0 512 512"
                style={{ position: "absolute", top: "60px", right: "80px" }}
            >
                {/* E and dot brand mark, same shapes as app/icon.svg */}
                <path
                    d="M326.49 406L88.31 406L88.31 106L325.13 106L325.13 164.63L161.95 164.63L161.95 228.27L303.31 228.27L303.31 281.45L161.95 281.45L161.95 346.91L326.49 346.91Z"
                    fill="#ece6d8"
                />
                <circle cx="387.69" cy="370" r="36" fill="#fc701f" />
            </svg>
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
                        backgroundColor: "#262626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#ffffff",
                    }}
                >
                    {/* eslint-disable-next-line */}
                    <img
                        src="https://github.com/eglenn-dev.png"
                        alt="Ethan Glenn"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%" }}
                    />
                </div>
                <div
                    style={{
                        fontSize: 24,
                        color: "#a49e91",
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
