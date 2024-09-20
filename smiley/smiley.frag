#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

// draws circle
float Circle(vec2 uv, vec2 position, float radius, float blur){
    float distance = length(uv-position);
    float mask = smoothstep(radius, radius - blur, distance);

    return mask;
}


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= 0.5; // remap coords to be centred
    uv.y *= u_resolution.y / u_resolution.x; // correct the aspect ratio

    // initialise colour, for bg
    vec3 colour = vec3(0.0,0.0,0.0);
    // draw bg circle
    float mask = Circle(uv, vec2(0.0,0.0), 0.4, 0.02);

    // draw eyes
    mask -= Circle(uv, vec2(0.15, 0.15), 0.1, 0.01);
    mask -= Circle(uv, vec2(-0.15, 0.15), 0.1, 0.01);

    float mouth = Circle(uv, vec2(0.0), 0.3, 0.02);
    mouth -= Circle(uv, vec2(0.0, 0.1), 0.3, 0.02);
    colour = vec3(mouth);


    mask -= mouth;
    // multiply colour by the mask to set the colour
    colour = vec3(1.0, 1.0, 0.0) * mask;
    gl_FragColor = vec4(vec3(colour), 1.0);
}
