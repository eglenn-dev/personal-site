/**
 * Rasterizes the hero name into a canvas whose alpha channel is glyph coverage.
 * The radiance cascades read that coverage as both emitter and occluder, so the
 * letters glow and cast shadows the same way the original triangle did.
 */
export async function rasterizeName(text: string): Promise<HTMLCanvasElement> {
  const fontSize = 220;
  const font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
  // next/font loads Inter asynchronously, and canvas silently falls back to the
  // system sans rather than triggering a load. A face that never arrives still
  // rasterizes with the fallback stack, so its failure is not worth surfacing.
  await document.fonts.load(font).catch(() => {});

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create the name raster canvas.");

  context.font = font;
  const metrics = context.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent;
  const padding = Math.round(fontSize * 0.2);
  canvas.width = Math.ceil(metrics.width) + padding * 2;
  canvas.height =
    Math.ceil(ascent + metrics.actualBoundingBoxDescent) + padding * 2;

  // Sizing the canvas resets the context, so the font has to be set again.
  context.font = font;
  context.textBaseline = "alphabetic";
  context.fillStyle = "#ffffff";
  context.fillText(text, padding, padding + ascent);
  return canvas;
}
