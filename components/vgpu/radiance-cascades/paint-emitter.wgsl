import { sdf_segment } from "./sdf-sample.wgsl";

// Accumulates the emitter texture: the fixed name glyphs plus everything the pointer has
// painted so far. RGB is linear radiance, A is the occluder mask the jump flood seeds from.
//
// Strokes combine with a component-wise max instead of a sum: a slow drag deposits dozens
// of overlapping capsules, and adding them would turn the overlap into a runaway HDR blob
// while max keeps every emitter at exactly the radiance it was painted with.

struct Paint {
  stroke_from: vec2f,
  stroke_to: vec2f,
  /** RGB radiance and an active flag. */
  color: vec4f,
  /** Keep-previous flag in x; y..w unused. */
  flags: vec4f,
};

@group(0) @binding(0) var<uniform> paint: Paint;
@group(0) @binding(1) var previous: texture_2d<f32>;
@group(0) @binding(2) var name_tex: texture_2d<f32>;
@group(0) @binding(3) var name_samp: sampler;

/** Warm white: the name reads as a light source, not as a coloured shape. */
const NAME_RADIANCE: vec3f = vec3f(3.8, 3.2, 2.4);

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let size = vec2f(textureDimensions(previous));
  let pixel = uv * size;
  let texel = vec2i(clamp(floor(pixel), vec2f(0.0), size - 1.0));

  var accumulated = vec4f(0.0);
  if (paint.flags.x > 0.5) {
    accumulated = textureLoad(previous, texel, 0);
  }

  // Contain the name raster in the middle of the canvas, preserving its aspect.
  let centre = size * 0.5;
  let name_size = vec2f(textureDimensions(name_tex));
  let aspect = name_size.x / max(name_size.y, 1.0);
  let quad_width = min(size.x * 0.78, size.y * 0.5 * aspect);
  let quad = vec2f(quad_width, quad_width / aspect);
  let local = (pixel - (centre - quad * 0.5)) / quad;
  // Sampling stays uniform; the rectangle test masks the result instead of
  // guarding the sample, so the gradient-dependent path is never divergent.
  let inside = f32(all(local >= vec2f(0.0)) && all(local <= vec2f(1.0)));
  let coverage = textureSampleLevel(
    name_tex,
    name_samp,
    clamp(local, vec2f(0.0), vec2f(1.0)),
    0.0,
  ).a * inside;
  accumulated = max(accumulated, vec4f(NAME_RADIANCE * coverage, coverage));

  if (paint.color.a > 0.5) {
    let stroke = 1.0 - smoothstep(
      -1.0,
      1.0,
      sdf_segment(pixel, paint.stroke_from, paint.stroke_to) - 5.0,
    );
    accumulated = max(accumulated, vec4f(paint.color.rgb * stroke, stroke));
  }

  return accumulated;
}
