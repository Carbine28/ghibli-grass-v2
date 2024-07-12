uniform sampler2D baseTex;
varying vec2 vuv;

#include ../../shaders/includes/ambientLight.glsl
#include ../../shaders/includes/directionalLight.glsl
#include ../../shaders/includes/pointLight.glsl

void main() {
  vec4 colors = texture2D(baseTex, vuv);
  gl_FragColor = colors;
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}