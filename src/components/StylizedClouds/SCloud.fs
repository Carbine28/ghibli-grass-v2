uniform sampler2D uCloudColorTex;
uniform sampler2D uCloudNormalTex;
uniform sampler2D uEdgeMaskTex;
uniform sampler2D uGradientMaskTex;
uniform sampler2D uNoiseTex;
uniform vec3 uCloudColor;
uniform float uShadowMin;
uniform float uShadowMax;
uniform float uLightIntensity;
uniform float uRimPower;
uniform vec3 uRimColor;
uniform float uGradientOffset;
uniform float uGradientMultiplier;
uniform float uNoiseGradientOffset;
uniform vec2 uNoiseSpeed;
uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldNormal;

vec3 blendNormals(vec3 A, vec3 B){
  return normalize(vec3(A.xy + B.xy, A.z * B.z));
}


float subtract(float A, float B){
  return A - B;
}

float multiply(float A, float B){
  return A * B;
}

void main() {
  vec4 color = texture(uCloudColorTex, vUv);
  if(color.a <= .1) discard ;
  color *= vec4(uCloudColor, 1.0);

  // Main (sun) light direction
  vec3 mainLightDirection = normalize(vec3(237.0, -240.0, 141.0));
  // End variables
  vec4 sampledNormal = texture(uCloudNormalTex, vUv);
  vec3 blendedNormal = blendNormals(sampledNormal.xyz, vWorldNormal);

  float normalDotLight = dot(blendedNormal, mainLightDirection);
  float absNormalDotLight = abs(normalDotLight);
  float negatedNormalDotLight  = -normalDotLight;

  vec4 edgeMask = texture(uEdgeMaskTex, vUv);
  vec4 rimLighting = edgeMask * negatedNormalDotLight * uRimPower;

  float normalDotAbsClamped = clamp(absNormalDotLight , uShadowMin, uShadowMax);
  float lightIntensityClamped = normalDotAbsClamped * uLightIntensity;
  color *= lightIntensityClamped;

  color = mix(color, vec4(uRimColor, 1.0), rimLighting);

  // 
  vec4 gradMask = texture(uGradientMaskTex, vUv);
  float gradOffset = subtract(gradMask.a, uGradientOffset);

  // Branch1
  float gradMultiplier = multiply(gradOffset, uGradientMultiplier);

  // Branch 2
  float gradNoiseOffset = subtract(uGradientOffset, uNoiseGradientOffset);
  gradNoiseOffset = multiply(uGradientMultiplier, gradNoiseOffset);
  vec4 edgeGradNoise = edgeMask * vec4(gradNoiseOffset);
  // Sample noise from texture;
  vec2 move = uNoiseSpeed * uTime;
  vec4 noise = texture(uNoiseTex, vUv + move);
  edgeGradNoise *= noise;
  // Branch1
  vec4 edgeGradient = edgeGradNoise + vec4(gradMultiplier);
  edgeGradient *= color.w;

  vec4 alpha = clamp(edgeGradient, vec4(0.0), vec4(1.0));
  gl_FragColor = vec4(color.xyz, alpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}