import { surface, type Gpu, type Surface } from "vgpu";

import { installLightPaintInput } from "./pointer-input";
import { rasterizeName } from "./name-raster";
import {
  createScene,
  destroyScene,
  prepareScene,
  presentScene,
  runChain,
  type RadianceScene,
  type RadianceView,
} from "./simulation";

interface RendererOptions {
  readonly canvas: HTMLCanvasElement;
  /** Text lit up in the middle of the canvas. */
  readonly name?: string;
}

export function createRenderer({
  canvas,
  name = "Ethan Glenn",
}: RendererOptions) {
  let disposed = false;
  // The debug views (emitters, distance field, cascade atlases) were only ever
  // reachable from the lab page's panel, so only the composed view ships.
  const VIEW: RadianceView = "final";
  let gpu: Gpu | undefined;
  let canvasSurface: Surface | undefined;
  let scene: RadianceScene | undefined;
  let input: ReturnType<typeof installLightPaintInput> | undefined;
  let nameTexture: GPUTexture | undefined;
  let observer: ResizeObserver | undefined;
  let unsubscribeResize: (() => void) | undefined;
  let animationFrame = 0;
  let resizeFrame = 0;
  let pendingSize:
    | { readonly width: number; readonly height: number; readonly dpr: number }
    | undefined;
  let lastDpr = typeof window === "undefined" ? 1 : window.devicePixelRatio;
  let sawInitialResize = false;
  let rebuilding = false;
  let dirty = true;
  let clearRequested = false;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    observer?.disconnect();
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", onWindowResize);
    }
    let firstError: unknown;
    for (const cleanup of [
      unsubscribeResize,
      () => input?.dispose(),
      () => nameTexture?.destroy(),
      () => gpu?.dispose(),
    ]) {
      try {
        cleanup?.();
      } catch (error) {
        firstError ??= error;
      }
    }
    if (firstError) throw firstError;
  };

  const fail = (error: unknown): never => {
    try {
      dispose();
    } catch {
      // Keep the operation failure primary after best-effort teardown.
    }
    throw error;
  };

  const rebuildScene = () => {
    if (disposed || !gpu || !canvasSurface) return;
    rebuilding = true;
    try {
      const next = createScene(gpu, canvasSurface.size, nameTexture!);
      const previous = scene;
      scene = next;
      if (previous) destroyScene(previous);
      clearRequested = true;
      dirty = true;
      void prepareScene(next, canvasSurface.format).catch((error: unknown) => {
        if (!disposed && scene === next) fail(error);
      });
    } catch (error) {
      fail(error);
    } finally {
      rebuilding = false;
    }
  };

  const onSurfaceResize = () => {
    if (!sawInitialResize) {
      sawInitialResize = true;
      return;
    }
    if (!rebuilding) rebuildScene();
  };

  const applyResize = () => {
    resizeFrame = 0;
    const size = pendingSize;
    pendingSize = undefined;
    if (disposed || !size || !canvasSurface) return;
    try {
      canvasSurface.resize([
        Math.max(1, Math.round(size.width * size.dpr)),
        Math.max(1, Math.round(size.height * size.dpr)),
      ]);
    } catch (error) {
      fail(error);
    }
  };

  const measure = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (disposed || width <= 0 || height <= 0) return;
    pendingSize = {
      width,
      height,
      dpr: Math.min(2, Math.max(1, window.devicePixelRatio || 1)),
    };
    if (!resizeFrame) resizeFrame = requestAnimationFrame(applyResize);
  };

  function onWindowResize() {
    if (window.devicePixelRatio === lastDpr) return;
    lastDpr = window.devicePixelRatio;
    measure();
  }

  const tick = () => {
    animationFrame = 0;
    if (disposed) return;
    if (!document.hidden && gpu && canvasSurface && scene && input) {
      try {
        const segment = input.take();
        if (segment) dirty = true;
        if (dirty) {
          runChain(scene, {
            segment,
            keepPrevious: !clearRequested,
            view: VIEW,
          });
          clearRequested = false;
          dirty = false;
        }
        presentScene(scene, canvasSurface, VIEW);
      } catch (error) {
        fail(error);
      }
    }
    animationFrame = requestAnimationFrame(tick);
  };

  const initialize = async () => {
    const { init } = await import("vgpu");
    if (disposed) return;
    const nextGpu = await init();
    if (disposed) {
      nextGpu.dispose();
      return;
    }
    gpu = nextGpu;
    canvasSurface = surface(gpu, canvas, { autoResize: false, dpr: [1, 2] });

    const raster = await rasterizeName(name);
    if (disposed) return;
    nameTexture = createNameTexture(gpu, raster);

    scene = createScene(gpu, canvasSurface.size, nameTexture);
    await prepareScene(scene, canvasSurface.format);
    if (disposed) return;

    input = installLightPaintInput(canvas);

    unsubscribeResize = canvasSurface.onResize(onSurfaceResize);
    observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    observer?.observe(canvas);
    window.addEventListener("resize", onWindowResize);
    measure();
    animationFrame = requestAnimationFrame(tick);
  };

  const ready = initialize().catch((error: unknown) => {
    if (!disposed) fail(error);
  });

  return { ready, dispose };
}

/** Uploads the rasterized name so the emitter pass can sample its coverage. */
function createNameTexture(gpu: Gpu, source: HTMLCanvasElement): GPUTexture {
  const texture = gpu.gpu.createTexture({
    label: "radiance-cascades-name",
    size: [source.width, source.height],
    format: "rgba8unorm",
    // COPY_DST | TEXTURE_BINDING | RENDER_ATTACHMENT
    usage: 0x02 | 0x04 | 0x10,
  });
  try {
    gpu.gpu.queue.copyExternalImageToTexture(
      { source },
      { texture },
      [source.width, source.height]
    );
    return texture;
  } catch (error) {
    try {
      texture.destroy();
    } catch {
      // Preserve the upload error after best-effort rollback.
    }
    throw error;
  }
}
