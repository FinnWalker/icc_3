AFRAME.registerShader('makewaves', {
    schema: {
      color: {
        type: 'color',
        is: 'uniform',
        default: '#0051da'
      },
      timeMsec: {
        type: 'time',
        is: 'uniform'
      },
      uMap: {
      type: 'map',
        is: 'uniform'
      }
    },

    vertexShader: `
#define SCALE 15.0

varying vec2 vUv;

uniform float timeMsec;  

float calculateSurface(float x, float z) {
    float uTime = timeMsec / 1000.0;
    float y = 0.0;
    y += (sin(x * 1.0 / SCALE + uTime * 1.0) + sin(x * 2.3 / SCALE + uTime * 1.5) + sin(x * 3.3 / SCALE + uTime * 0.4)) / 3.0;
    y += (sin(z * 0.2 / SCALE + uTime * 1.8) + sin(z * 1.8 / SCALE + uTime * 1.8) + sin(z * 2.8 / SCALE + uTime * 0.8)) / 3.0;
    return y;
}

void main() {
    float uTime = timeMsec / 1000.0;
    vUv = uv;
    vec3 pos = position;    
    float strength = 1.0;
    pos.y += strength * calculateSurface(pos.x, pos.z);
    pos.y -= strength * calculateSurface(0.0, 0.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}  
`,
    fragmentShader: `
varying vec2 vUv;

uniform sampler2D uMap;

uniform vec3 color;

uniform float timeMsec; 

void main() {
    float uTime = timeMsec / 2000.0;     
    vec2 uv = vUv * 10.0 + vec2(uTime * -0.05, uTime * 0.4);
    

    uv.y += 0.01 * (sin(uv.x * 3.5 + uTime * 0.35) + sin(uv.x * 4.8 + uTime * 1.05) + sin(uv.x * 7.3 + uTime * 0.45)) / 3.0;
    uv.x += 0.12 * (sin(uv.y * 4.0 + uTime * 0.5) + sin(uv.y * 6.8 + uTime * 0.75) + sin(uv.y * 11.3 + uTime * 0.2)) / 3.0;
    uv.y += 0.12 * (sin(uv.x * 4.2 + uTime * 0.64) + sin(uv.x * 6.3 + uTime * 1.65) + sin(uv.x * 8.2 + uTime * 0.45)) / 3.0;

    vec4 tex1 = texture2D(uMap, uv * 0.5 + vec2(0.5));
    vec4 tex2 = texture2D(uMap, uv * 0.25 + vec2(0.15));
    vec3 blue = color;

    gl_FragColor = vec4(blue + vec3(tex1.a * 0.2 - tex2.a * 0.15), 1.0);

}`
  });