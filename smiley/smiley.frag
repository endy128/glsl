#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

// draws circle
float Circle(vec2 uv, vec2 position, float radius, float blur) {
    float distance = length(uv - position);
    float mask = smoothstep(radius, radius - blur, distance);

    return mask;
}

float Band(float t, float start, float end, float blur) {
    float step1 = smoothstep(start - blur, start + blur, t);
    float step2 = smoothstep(end + blur, end - blur, t);
    return step1 * step2;
}

float Rect(vec2 uv, float left, float right, float bottom, float top, float blur) {
    float band1 = Band(uv.x, left, right, blur);
    float band2 = Band(uv.y, bottom, top, blur);
    return band1 * band2;
}

float Smiley(vec2 uv, vec2 position, float size) {
    // translate coordinate system
    uv -= position;
    // scaling th coordingate system
    uv /= size;
    
    // draw bg circle
    float mask = Circle(uv, vec2(0.0, 0.0), 0.4, 0.02);

    // draw eyes
    mask -= Circle(uv, vec2(0.15, 0.15), 0.1, 0.02);
    mask -= Circle(uv, vec2(-0.15, 0.15), 0.1, 0.02);

    // draw mouth
    float mouth = Circle(uv, vec2(0.0), 0.3, 0.02);
    mouth -= Circle(uv, vec2(0.0, 0.1), 0.3, 0.02);

    // subtract mouth from existing mask
    mask -= mouth;

    return mask;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= 0.5; // remap coords to be centred
    uv.y *= u_resolution.y / u_resolution.x; // correct the aspect ratio

    // initialise colour, for bg
    vec3 color = vec3(0.0, 0.0, 0.0);

    // float mask = Smiley(uv, vec2(0.0,0.0), 0.6);

    float mask = 0.0;

    mask = Rect(uv, -0.2, 0.2, -0.3, 0.3, 0.01);

    // multiply colour by the mask to set the colour
    // so either 1x or 0x...
    color = vec3(1.0, 1.0, 1.0) * mask;
    gl_FragColor = vec4(color, 1.0);
}
