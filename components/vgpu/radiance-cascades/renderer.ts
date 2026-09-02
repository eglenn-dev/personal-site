import { init, surface, type Gpu, type Surface } from "vgpu";

import { installLightPaintInput } from "./pointer-input";
import { rasterizeName } from "./name-raster";
import {
  createScene,
  prepareScene,
  renderScene,
  resizeScene,
  type RadianceScene,
} from "./simulation";

interface RendererOptions {
  readonly canvas: HTMLCanvasElement;
  /** Text lit up in the middle of the canvas. */
  readonly name: string;
  /** Called once when the scene cannot be brought up or cannot keep running. */
  readonly onError: (error: unknown) => void;
}

// Simulating at full device resolution quadruples the cascade atlas and every
// pass's fill for a scene that is mostly soft glow. 1.5x keeps the glyph edges
// crisp on retina at under half the memory.
const MAX_DPR = 1.5;
// Dragging a window edge fires ResizeObserver every frame and each one recreates
// every texture, so only the trailing edge is worth acting on.
const RESIZE_SETTLE_MS = 150;

export function createRenderer({ canvas, name, onError }: RendererOptions) {
  let disposed = false;
  let gpu: Gpu | undefined;
  let canvasSurface: Surface | undefined;
  let scene: RadianceScene | undefined;
  let input: ReturnType<typeof installLightPaintInput> | undefined;
  let nameTexture: GPUTexture | undefined;
  let observer: ResizeObserver | undefined;
  let animationFrame = 0;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  let lastDpr = window.devicePixelRatio;
  // The first chain has no previous emitter to accumulate onto, and neither does
  // the first one after a resize hands back cleared targets.
  let clearRequested = true;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (resizeTimer) clearTimeout(resizeTimer);
    observer?.disconnect();
    window.removeEventListener("resize", onWindowResize);
    try {
      input?.dispose();
      nameTexture?.destroy();
      // Targets belong to the device, so this releases the whole scene with it.
      gpu?.dispose();
    } catch (error) {
      // Teardown runs from React's cleanup, where throwing takes the unmount
      // down with it.
      console.error("Radiance cascades teardown failed.", error);
    }
  };

  const fail = (error: unknown) => {
    if (disposed) return;
    dispose();
    onError(error);
  };

  /**
   * One frame is one full chain plus its present. Nothing schedules the next
   * one: the canvas keeps showing the last frame it was handed, so the loop only
   * runs while the pointer is painting or a resize has invalidated the targets.
   */
  const tick = () => {
    animationFrame = 0;
    if (disposed || !canvasSurface || !scene || !input) return;
    try {
      renderScene(scene, canvasSurface, {
        segment: input.take(),
        keepPrevious: !clearRequested,
      });
      clearRequested = false;
    } catch (error) {
      fail(error);
    }
  };

  const requestRender = () => {
    if (disposed || animationFrame) return;
    animationFrame = requestAnimationFrame(tick);
  };

  const applyResize = () => {
    resizeTimer = undefined;
    if (disposed || !canvasSurface || !scene) return;
    const { width, height } = canvas.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;
    const dpr = Math.min(MAX_DPR, Math.max(1, window.devicePixelRatio || 1));
    const pixels: [number, number] = [
      Math.max(1, Math.round(width * dpr)),
      Math.max(1, Math.round(height * dpr)),
    ];
    if (pixels[0] === scene.size[0] && pixels[1] === scene.size[1]) return;
    try {
      canvasSurface.resize(pixels);
      resizeScene(scene, canvasSurface.size);
    } catch (error) {
      fail(error);
      return;
    }
    clearRequested = true;
    requestRender();
  };

  const scheduleResize = () => {
    if (disposed) return;
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyResize, RESIZE_SETTLE_MS);
  };

  function onWindowResize() {
    if (window.devicePixelRatio === lastDpr) return;
    lastDpr = window.devicePixelRatio;
    scheduleResize();
  }

  const initialize = async () => {
    const nextGpu = await init();
    if (disposed) {
      nextGpu.dispose();
      return;
    }
    gpu = nextGpu;
    canvasSurface = surface(gpu, canvas, {
      autoResize: false,
      dpr: [1, MAX_DPR],
    });

    const raster = await rasterizeName(name);
    if (disposed) return;
    nameTexture = createNameTexture(gpu, raster);

    scene = createScene(gpu, canvasSurface.size, nameTexture);
    await prepareScene(scene, canvasSurface.format);
    if (disposed) return;

    input = installLightPaintInput(canvas, requestRender);
    observer = new ResizeObserver(scheduleResize);
    observer.observe(canvas);
    window.addEventListener("resize", onWindowResize);
    requestRender();
  };

  const ready = initialize();
  ready.catch(fail);

  return { ready, dispose };
}

/** Uploads the rasterized name so the emitter pass can sample its coverage. */
function createNameTexture(gpu: Gpu, source: HTMLCanvasElement): GPUTexture {
  const texture = gpu.gpu.createTexture({
    label: "radiance-cascades-name",
    size: [source.width, source.height],
    format: "rgba8unorm",
    usage:
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.TEXTURE_BINDING |
      // copyExternalImageToTexture validates the destination for this too.
      GPUTextureUsage.RENDER_ATTACHMENT,
  });
  gpu.gpu.queue.copyExternalImageToTexture(
    { source },
    { texture },
    [source.width, source.height]
  );
  return texture;
}
