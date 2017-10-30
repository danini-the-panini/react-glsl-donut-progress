import React from 'react';
import GLSLCanvas from './GLSLCanvas';

/**
String that containes our fragment shader.
You can also use 
https://github.com/stackgl/glslify
https://github.com/stackgl/glslify-loader
Or
https://github.com/grieve/webpack-glsl-loader
**/
let myFragShader = `
#version 100

precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_percent;
uniform vec3 u_background;

#define PI 3.14159265359

const float G = 0.05;
const float INNER = 0.3;
const float OUTER = 0.35;
const float CENTER = (OUTER + INNER) / 2.0;
const float WIDTH = OUTER - INNER;

vec3 getColor(float p)
{
    vec3 colors[5];
    colors[0] = vec3(0.3019607843, 0.737254902, 0.05490196078);
    colors[1] = vec3(0.9803921569, 0.6941176471, 0.01568627451);
    colors[2] = vec3(1.0, 0.3647058824, 0.01568627451);
    colors[3] = vec3(1.0, 0.2156862745, 0.05490196078);
    colors[4] = vec3(1.0, 0.2156862745, 0.05490196078);

    float points[4];
    points[0] = 0.3;
    points[1] = 0.45;
    points[2] = 0.55;
    points[3] = 1.0;

    vec3 c = vec3(0.0, 0.0, 0.0);
    for (int i = 3; i >= 0; i--) {
        if (p < points[i] - G) {
            c = colors[i];
        } else if (p < points[i] + G) {
            c = mix(colors[i], colors[i+1], (p - (points[i]-G))/(G*2.0));
        }
    }
    return c;
}

float getP(vec2 uv)
{
    float a = atan(uv.y / uv.x)/1.57079632679;
    float b = (a + 1.0)/2.0;
    if (uv.x < 0.0) {
        b = (b / 2.0) + 0.5;
    } else {
        b = b / 2.0;
    }
    return 1.0 - b;
}

vec3 renderPixel(vec2 pixel)
{
    vec3 o = u_background;

    float P = u_percent;
    
    float Pa = P * PI * 2.0 + (PI * 0.5);
    
    vec2 sp = vec2(cos(PI * 0.5) * CENTER, -sin(PI * 0.5) * CENTER);
    vec2 ep = vec2(cos(Pa) * CENTER, -sin(Pa) * CENTER);
    
    float aspect = u_resolution.x / u_resolution.y;
	  vec2 uv = pixel.xy / u_resolution.xy;
    uv.x *= aspect;
    vec2 uv2 = vec2(0.5-uv.x, 0.5-uv.y);
    float r = length(uv2);
    float rc = 0.0;
    if (length(uv2 - sp) < WIDTH / 2.0) {
        o = getColor(0.0);
    }
    else if (length(uv2 - ep) < WIDTH / 2.0) {
        o = getColor(P);
    }
    else if (r > INNER && r < OUTER) {
        float p = getP(uv2);
        if (p < P) {
            vec3 c = getColor(p);
            o = getColor(p);
        } else {
            o = vec3(0.9019607843, 0.9411764706, 0.9725490196);
        }
    }
    return o;
}

void main()
{
    float X = 0.25;
    vec3 a = renderPixel(gl_FragCoord.xy + vec2( X,  X));
    vec3 b = renderPixel(gl_FragCoord.xy + vec2(-X,  X));
    vec3 c = renderPixel(gl_FragCoord.xy + vec2(-X, -X));
    vec3 d = renderPixel(gl_FragCoord.xy + vec2( X, -X));
    gl_FragColor = vec4((a+b+c+d)/4.0, 1.0);
    // gl_FragColor = vec4(renderPixel(gl_FragCoord.xy), 1.0);
}
`;

export default class Demo extends React.Component {
  render() {
    return (
      <div style={{ border: '1px solid black', backgroundColor: '#FFF', display: 'inline-block' }}>
        <GLSLCanvas
          frag={myFragShader} //Our fragment shader
          width={512} //Width of the canvas 
          height={512} //Height of the canvas
          uniforms={[{ name: 'u_percent', value: this.props.percent }, { name: 'u_background', value: this.props.background}]}
        />
      </div>
    );
  }
}
