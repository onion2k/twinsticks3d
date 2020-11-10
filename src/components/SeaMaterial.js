import * as THREE from "three"
import { extend } from "react-three-fiber"

class SeaMaterial extends THREE.ShaderMaterial {
    constructor() {
    super({
      uniforms: { time: { value: 1.0 }, color: { value: new THREE.Color(0.2, 0.0, 0.1) } },
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
      fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      void main() {
        gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
      }
      `
    })
  }
  get color() {
    return this.uniforms.color.value
  }
  get time() {
    return this.uniforms.time.value
  }
  set time(v) {
    return (this.uniforms.time.value = v)
  }
}

extend({ SeaMaterial })