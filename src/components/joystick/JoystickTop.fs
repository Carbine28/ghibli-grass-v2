varying vec2 vuv;

void main() {
  vec4 color =  vec4(0.576, 0.663, 0.616, 1.0);
  color = mix(color, vec4(0.725, 0.843, 0.933, 1.0), 0.6);
  gl_FragColor = color;
}
