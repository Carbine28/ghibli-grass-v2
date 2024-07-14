uniform sampler2D noiseMap;
uniform sampler2D edgeMap;
uniform sampler2D normalMap;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 direction = vec2(1,0);
  vec2 move = direction * uTime * 0.01;
  vec4 color = texture(noiseMap, uv + move);
  // Sample the edge map texture
  vec4 edgeColor = texture(edgeMap, vUv);
  // Sample the normal map texture
  vec3 normalColor = texture(normalMap, vUv).rgb;

  if(color.r <= 0.5) {
    color.a = 0.0;
  }
  
  vec4 combinedColor = color * edgeColor;
  combinedColor.rgb += vec3(0.4);
  gl_FragColor = combinedColor;
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}