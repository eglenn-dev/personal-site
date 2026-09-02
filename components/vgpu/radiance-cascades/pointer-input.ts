export interface PaintSegment {
  readonly from: readonly [number, number];
  readonly to: readonly [number, number];
  readonly stroke: number;
}

/**
 * Collects pointer drags into one coalesced segment per frame.
 *
 * `onPaint` fires whenever a segment is waiting, which is what drives the render
 * loop -- there is no idle polling, so the scene costs nothing between strokes.
 */
export function installLightPaintInput(
  canvas: HTMLCanvasElement,
  onPaint: () => void
) {
  let activePointer = -1;
  let stroke = 0;
  let last: [number, number] = [0.5, 0.5];
  let pending:
    | { from: [number, number]; to: [number, number]; stroke: number }
    | undefined;

  const point = (event: PointerEvent): [number, number] => {
    const rect = canvas.getBoundingClientRect();
    return [
      Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width))
      ),
      Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height))
      ),
    ];
  };

  const extend = (from: [number, number], to: [number, number]) => {
    if (pending?.stroke === stroke) pending.to = to;
    else pending = { from, to, stroke };
    onPaint();
  };

  const down = (event: PointerEvent) => {
    if (!event.isPrimary || activePointer !== -1) return;
    canvas.setPointerCapture(event.pointerId);
    activePointer = event.pointerId;
    stroke++;
    last = point(event);
    extend(last, last);
  };

  const move = (event: PointerEvent) => {
    if (!event.isPrimary || event.pointerId !== activePointer) return;
    const next = point(event);
    extend(last, next);
    last = next;
  };

  const release = () => {
    if (activePointer === -1) return;
    if (canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = -1;
  };

  const up = (event: PointerEvent) => {
    if (!event.isPrimary || event.pointerId !== activePointer) return;
    release();
  };

  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);

  return {
    take(): PaintSegment | undefined {
      const segment = pending;
      pending = undefined;
      return segment;
    },
    dispose() {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      release();
      pending = undefined;
    },
  };
}
