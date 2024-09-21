#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// draws circle
float Circle(vec2 uv, vec2 position, float radius, float blur) {
    float distance = length(uv - position);
    float mask = smoothstep(radius, radius - blur, distance);

    return mask;
}

float Band(float position, float start, float end, float blur) {
    float step1 = smoothstep(start - blur, start + blur, position);
    float step2 = smoothstep(end + blur, end - blur, position);
    return step1 * step2;
}

float Rect(vec2 uv, float left, float right, float bottom, float top, float blur) {
    float band1 = Band(uv.x, left, right, blur);
    float band2 = Band(uv.y, bottom, top, blur);
    return band1 * band2;
}

float Rect2(vec2 uv, float position_x, float position_y, float width, float height, float blur) {
    // to centre the rectangle
    float offset_h = width * 0.5;
    float offset_y = height * 0.5;
    float band_h = Band(uv.x, position_x - offset_h, position_x - offset_h+ width, blur);
    float band_v = Band(uv.y, position_y - offset_y, position_y - offset_y+ height, blur);
    return band_h * band_v;
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

    // mask = Rect(uv, -0.2, 0.2, -0.3, 0.3, 0.01);


    float radius = 0.2;
    float frequency = 2.0;
    float pos_x = cos(u_time * frequency) * radius;
    float pos_y = sin(u_time * frequency) * radius;

    // draws a rectange and moves it in a circle
    mask = Rect2(uv, pos_x, pos_y, 0.2, 0.3, 0.01);

    mask = Smiley(uv, vec2(pos_x,pos_y), 0.6);

    // multiply colour by the mask to set the colour
    // so either 1x or 0x...
    color = vec3(1.0, 1.0, 0.0) * mask;
    gl_FragColor = vec4(color, 1.0);
}
