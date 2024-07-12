varying vec2 vuv;
uniform sampler2D heightMap;
uniform float heightScale;
varying float frc;
uniform float uTime;

void main() {

  // vec4 heightData = texture(heightMap, uv);
  // float height = heightData.r * heightScale;
  // vec3 offset = vec3(0., height, 0.);
  // vec4 mvPosition = vec4(position + offset, 1.0);
  vec4 mvPosition = vec4(position, 1.0);
  mvPosition = instanceMatrix * mvPosition;

  // Wind
  float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
  dispPower *= 0.1;
  float displacement = sin( mvPosition.z + uTime * 5.0 ) * ( 0.1 * dispPower );
  mvPosition.z += displacement;

  vec4 modelViewPosition = modelMatrix * viewMatrix * mvPosition;
  gl_Position = projectionMatrix * modelViewPosition;
  vuv = uv;
  frc = mvPosition.y / 0.8;
}