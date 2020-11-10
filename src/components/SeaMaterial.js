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
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        float random(float x) {
          return fract(sin(x) * 10000.);
        }
        
        float noise(vec2 p) {
            return random(p.x + p.y * 10000.);
        }
        
        vec2 sw(vec2 p) { return vec2(floor(p.x), floor(p.y)); }
        vec2 se(vec2 p) { return vec2(ceil(p.x), floor(p.y)); }
        vec2 nw(vec2 p) { return vec2(floor(p.x), ceil(p.y)); }
        vec2 ne(vec2 p) { return vec2(ceil(p.x), ceil(p.y)); }
        
        float smoothNoise(vec2 p) {
        
            vec2 interp = smoothstep(0., 1., fract(p));
            float s = mix(noise(sw(p)), noise(se(p)), interp.x);
            float n = mix(noise(nw(p)), noise(ne(p)), interp.x);
            return mix(s, n, interp.y);
                
        }
        
        float fractalNoise(vec2 p) {
        
            float x = 0.;
            x += smoothNoise(p);
            x += smoothNoise(p * 2. ) / 2.;
            x += smoothNoise(p * 4. ) / 4.;
            x += smoothNoise(p * 8. ) / 8.;
            x += smoothNoise(p * 16.) / 16.;
            x /= 1. + 1./2. + 1./4. + 1./8. + 1./16.;
            return x;
                    
        }
        
        float movingNoise(vec2 p) {
        
            float x = fractalNoise(p + time);
            float y = fractalNoise(p - time);
            return fractalNoise(p + vec2(x, y));   
            
        }
        
        // call this for water noise function
        float nestedNoise(vec2 p) {
            float x = movingNoise(p);
            float y = movingNoise(p + 100.);
            return movingNoise(p + vec2(x, y));
        }

        void main()
        {
          vec2 uv = gl_FragCoord.xy / 200.;
          float n = nestedNoise(uv * 6.);
            
          gl_FragColor = vec4(mix(vec3(.4, .6, 1.), vec3(.1, .2, 1.), n), 1.);
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