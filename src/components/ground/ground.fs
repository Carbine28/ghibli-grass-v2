
uniform sampler2D colorMap;
varying vec2 vuv;

void main() {
  // vec4 color = texture(colorMap, vuv);
  vec4 color = vec4(0.4, 0.6, 0.2, 1.0);

  // // Apply color based on height map data
  // if (color.r >= 0.8) {
  //   color = vec4(0.8, 0.8, 0.4, 1.0);  // Pale yellow-green
  // } else if (color.r >= 0.35) {
  //   color = mix(vec4(0.8, 0.8, 0.4, 1.0), vec4(0.4, 0.6, 0.2, 1.0), smoothstep(0.7, 0.9, color.r)); // Light green
  // } else if (color.r >= 0.02) {
  //   color = mix(vec4(0.4, 0.6, 0.2, 1.0), vec4(0.1, 0.3, 0.1, 1.0), smoothstep(0.3, 0.7, color.r)); // Darker green
  // } else {
  //   color = vec4(0.1, 0.3, 0.1, 1.0);  // Darkest green
  // }
  
  gl_FragColor = color;
}