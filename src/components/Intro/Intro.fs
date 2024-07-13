uniform sampler2D mask;
uniform float scale;
varying vec2 vuv;


void main(){
  float s = scale * 7.5;
  float cutoff = step(7.5, s);
  vec2 offset = vec2(0.5, 0.5) * (1.0 - s);
  vec4 maskColor = texture(mask, vuv * s + offset);
  vec4 color = vec4(0, 0, 0, 1);
  color.w = 1.0 - maskColor.w + cutoff;
  gl_FragColor = color;
}