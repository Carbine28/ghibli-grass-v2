varying vec2 vuv;

void main() {
  // Define Ghibli-inspired colors with a sky blue accent
  vec4 baseColor = vec4(0.576, 0.663, 0.616, 1.0);  // Original color (greenish)
  vec4 accentColor = vec4(0.482, 0.725, 0.886, 1.0);  // Sky blue accent color

  // Mix the colors to achieve a sky blue-green look
  vec4 mixedColor = mix(baseColor, accentColor, 0.5);  // Adjust mix ratio as desired

  gl_FragColor = mixedColor;
}

