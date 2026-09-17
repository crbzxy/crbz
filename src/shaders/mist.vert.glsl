varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPosition = world.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
