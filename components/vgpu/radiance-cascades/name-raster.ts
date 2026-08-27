/**
 * Rasterizes the hero name into a canvas whose alpha channel is glyph coverage.
 * The radiance cascades read that coverage as both emitter and occluder, so the
 * letters glow and cast shadows the same way the original triangle did.
 */
export async function rasterizeName(text: string): Promise<HTMLCanvasElement> {
    // next/font loads Inter asynchronously; without this the first raster can
    // silently fall back to the system sans.
    if (document.fonts) {
        try {
            await document.fonts.ready;
        } catch {
            // A font that never settles still rasterizes with the fallback stack.
        }
    }

    const fontSize = 220;
    const font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    const measured = measure(text, font);
    const padding = Math.round(fontSize * 0.2);
    const width = Math.ceil(measured.width) + padding * 2;
    const height = Math.ceil(measured.ascent + measured.descent) + padding * 2;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not create the name raster canvas.");

    context.font = font;
    context.textBaseline = "alphabetic";
    context.fillStyle = "#ffffff";
    context.fillText(text, padding, padding + measured.ascent);
    return canvas;
}

function measure(text: string, font: string) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not measure the name.");
    context.font = font;
    const metrics = context.measureText(text);
    return {
        width: metrics.width,
        ascent: metrics.actualBoundingBoxAscent,
        descent: metrics.actualBoundingBoxDescent,
    };
}
