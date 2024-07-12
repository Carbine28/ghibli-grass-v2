varying vec2 vuv;
uniform sampler2D heightMap;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0); 
  // // Sample height map
  // vec4 heightData = texture(heightMap, uv);
  // // Apply level of height
  // float height = heightData.r * heightScale;
  // modelPosition.y += height;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  vuv = uv;
}
