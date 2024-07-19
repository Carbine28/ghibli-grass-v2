varying vec2 vuv;
varying float frc;
uniform float diffuseMultiplier;

void main() {
  vec4 tipColor = vec4(143.0/255.0, 172.0/255.0, 103.0/255.0, 1.0);
  vec4 baseColor = vec4(61.0/255.0, 114.0/255.0, 73.0/255.0, 1.0);
// 
  vec4 col = mix(baseColor, tipColor, frc);
  
  // float lightScale = diffuseMultiplier;
  col *= diffuseMultiplier;
  // col = mix(tipColor, baseColor, frc);

  // vec4 col = mix(tipColor, baseColor, frc);
  // col = mix(baseColor, tipColor, frc);

  // col = mix(baseColor, baseHeightCol, frc);
  // vec4 col = height;

  gl_FragColor = col;
  // #include <tonemapping_fragment>
  // #include <colorspace_fragment>
}