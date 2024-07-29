uniform sampler2D noiseMap;
uniform sampler2D edgeMap;
uniform float uTime;
uniform float lightFactor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 direction = vec2(1,0);
  vec2 move = direction * uTime * 0.003;
  // vec2 move = direction * uTime * 0.12;

  vec4 color = texture(noiseMap, uv + move);

  // color.rgb *= normal.rgb;
  // Sample the edge map texture
  // vec4 edgeColor = texture(edgeMap, vUv);

  color.a = 0.0;
  // if(color.r >= 0.7){
  //   color.a = 0.05;
  // } 
  // a
  if(color.r >= 0.95){
    color.a = 1.0;
  }
  // if(color.r <= 0.8) {
  //   color.a = 0.0;
  // } else if (olor.r <= 0.7)
  
  vec4 cloudColor = vec4( 118.0/255.0, 168.0/255.0, 168.0/255.0 ,1.0);
  vec4 combinedColor = color * cloudColor;
  combinedColor.rgb += vec3(0.4);
  combinedColor.rgb *= lightFactor;
  gl_FragColor = combinedColor;
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}