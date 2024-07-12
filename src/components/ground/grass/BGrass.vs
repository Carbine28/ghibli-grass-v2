varying vec2 vuv;
varying float frc;
uniform float uTime;
attribute vec3 offset;

void main() {
  // vec3 offset = vec3(0., height, 0.);
  // vec4 mvPosition = vec4(position + offset, 1.0);
  vec4 mvPosition = vec4(position + offset, 1.0);
  // mvPosition.x += offset.x;
  // mvPosition.z += offset.z;

  // mvPosition = instanceMatrix * mvPosition;

  // Wind
  // float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
  // dispPower *= 0.0;
  // float displacement = sin( mvPosition.z + uTime * 5.0 ) * ( 0.1 * dispPower );
  // mvPosition.z += displacement;

  vec4 modelViewPosition = modelMatrix * viewMatrix * mvPosition;
  gl_Position = projectionMatrix * modelViewPosition;
  vuv = uv;
  frc = mvPosition.y / 0.8;
}