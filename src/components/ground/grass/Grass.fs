varying vec2 vuv;
uniform sampler2D heightMap;
varying float frc;

#include ../../../shaders/includes/ambientLight.glsl
#include ../../../shaders/includes/directionalLight.glsl
#include ../../../shaders/includes/pointLight.glsl

void main() {

  vec4 height = texture2D(heightMap, vuv);
  vec4 baseHeightCol = vec4(0,0,0,1);
  // Apply color based on height map data
  if (height.r >= 0.8) {
    baseHeightCol = vec4(0.8, 0.8, 0.4, 1.0);  // Pale yellow-green
  } else if (height.r >= 0.35) {
    baseHeightCol = mix(vec4(0.8, 0.8, 0.4, 1.0), vec4(0.4, 0.6, 0.2, 1.0), smoothstep(0.7, 0.9, height.r)); // Light green
  } else if (height.r >= 0.02) {
    baseHeightCol = mix(vec4(0.4, 0.6, 0.2, 1.0), vec4(0.1, 0.3, 0.1, 1.0), smoothstep(0.3, 0.7, height.r)); // Darker green
  } else {
    baseHeightCol = vec4(0.1, 0.3, 0.1, 1.0);  // Darkest green
  }

  // vec4 tipColor = vec4(143.0/255.0, 172.0/255.0, 103.0/255.0, 1.0);
  // vec4 baseColor = vec4(61.0/255.0, 114.0/255.0, 73.0/255.0, 1.0);
  // vec4 col = mix(tipColor, baseHeightCol, frc);
  // vec4 col = mix(baseHeightCol, tipColor, frc);
  // col = mix(baseColor, baseHeightCol, frc);
  vec4 col = height;

  gl_FragColor = col;
  // #include <tonemapping_fragment>
  // #include <colorspace_fragment>
}