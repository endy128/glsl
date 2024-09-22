#ifdef GL_ES
precision mediump float;
#endif

#define sat(x) clamp(x, 0.0, 1.0)

uniform vec2 u_resolution;
uniform float u_time;

// remap num between 0-1 where a and b are the range
float remap01(float a, float b, float num){
    return sat((num-a) / (b-a));
}

// if num = a return c
// if num = b return d and anything inbetween
float remap(float a, float b, float c, float d, float num) {
    return ((num-a) / (b-a)) * (d-c) + c;
}

vec4 Head(vec2 uv){
    vec4 col = vec4(0.9, 0.65 , 0.1 ,1.0);

    // draw circle
    float distance = length(uv);
    col.a = smoothstep(0.5, 0.49, distance);

    // shading
    float edgeShade = remap01(0.35, 0.5, distance);

    col.rgb *= 1.0 - edgeShade;
    
    return col;
}

vec4 Mouth(vec2 uv){
    vec4 col = vec4(0.0);

    return col;
}

vec4 Eye(vec2 uv){
    vec4 col = vec4(0.0);

    return col;
}

vec4 Smiley(vec2 uv){
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);

    vec4 head = Head(uv);

    //blend two colours
    col = mix(col, head, head.a);
    return col;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= 0.5; // remap coords to be centred
    uv.y *= u_resolution.y / u_resolution.x; // correct the aspect ratio


    gl_FragColor = Smiley(uv);
}
