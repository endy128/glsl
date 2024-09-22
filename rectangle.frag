#ifdef GL_ES
precision mediump float;
#endif

#define sat(x) clamp(x, 0.0, 1.0)

uniform vec2 u_resolution;
uniform float u_time;

// remap num between 0-1 where a and b are the range
float remap01(float a, float b, float num) {
    return sat((num - a) / (b - a));
}

// if num = a return c
// if num = b return d and anything inbetween
float remap(float a, float b, float c, float d, float num) {
    return ((num - a) / (b - a)) * (d - c) + c;
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
    float offset_h = width * 0.5; // 0.5
    float offset_y = height * 0.5;
    float band_h = Band(uv.x, position_x - offset_h, position_x - offset_h + width, blur);
    float band_v = Band(uv.y, position_y - offset_y, position_y - offset_y + height, blur);
    return band_h * band_v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= 0.5; // remap coords to be centred
    uv.y *= u_resolution.y / u_resolution.x; // correct the aspect ratio

    float x = uv.x;
    float y = uv.y;

    // x = remap(-1.0, 1.0, -2.0, 2.0, x);

    float n = -sqrt(pow(-x, 2.0) + pow(0.5, 2.0));
    // float n = 0.0;

    // float mask = Rect2(vec2(x,y+n), 0.0, 0.0, 0.7, 0.03, 0.01);
    // float mask = Rect(vec2(x,y+n), -0.5, 0.5, -0.01, 0.01, 0.01);

    vec2 position = vec2(0.0, 0.0);

    float distance = 0.0;
    if (uv.y < 0.0) {
        distance = length(uv - position);
    }
    float radius = 0.2;
    float mask = 1.0 - smoothstep(0.0, 0.01, abs(radius-distance));

    vec3 color = vec3(1.1, 1.0, 0.0) * mask;
    gl_FragColor = vec4(color, 1.0);
}
