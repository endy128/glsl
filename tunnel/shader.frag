precision highp float;

uniform vec2 u_resolution;  // viewport resolution (in pixels)
uniform float u_time;       // shader playback time (in seconds)

// Function to create a checkerboard pattern
vec4 checkerboardPattern(vec2 uv, float scale) {
    // Make sure we have proper wrapping
    uv = fract(uv);
    
    vec2 grid = floor(uv * scale);
    float checker = mod(grid.x + grid.y, 2.0);
    
    // Create some color variation based on position
    vec3 color1 = vec3(0.8, 0.3, 0.1); // Orange-ish
    vec3 color2 = vec3(0.1, 0.3, 0.8); // Blue-ish
    
    // Smooth the transition between checker squares to reduce aliasing
    vec2 smoothGrid = fract(uv * scale);
    smoothGrid = smoothstep(0.05, 0.95, smoothGrid);
    float smoothChecker = abs(smoothGrid.x - 0.5) + abs(smoothGrid.y - 0.5);
    
    // Mix colors based on the checker value with anti-aliasing
    vec3 finalColor = mix(color1, color2, checker);
    
    // Add subtle variation without creating discontinuities
    float variation = sin(u_time * 0.5) * 0.1;
    finalColor += variation * sin(uv.x * 6.28318 + u_time) * sin(uv.y * 6.28318 + u_time);
    
    return vec4(finalColor, 1.0);
}

void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Compute aspect ratio
    float aspectRatio = u_resolution.x / u_resolution.y;
    
    // Center the coordinates and correct for aspect ratio
    vec2 p = uv - 0.5;
    if (aspectRatio > 1.0) {
        // Wider than tall - adjust x coordinates
        p.x *= aspectRatio;
    } else {
        // Taller than wide - adjust y coordinates
        p.y /= aspectRatio;
    }
    
    // Calculate the angle and distance from center
    float angle = atan(p.y, p.x);
    float dist = length(p) + 0.001; // Small offset to avoid division by zero
    
    // Normalize angle to [0, 1] range
    float normAngle = (angle + 3.14159) / (2.0 * 3.14159);
    
    // Create the tunnel effect coordinate transformation
    vec2 tunnelUV = vec2(
        normAngle + u_time * 0.1,              // horizontal coordinate (rotates tunnel)
        0.2 / dist + u_time * 0.2              // vertical coordinate (moves into tunnel)
    );
    
    // Get the pattern color
    vec4 color = checkerboardPattern(tunnelUV, 8.0);
    
    // Add depth effect
    // float depthDarken = smoothstep(0.0, 0.1, dist);
    color.rgb *= smoothstep(0.0, 1.0, dist * 3.0);
    
    // Output the final color
    gl_FragColor = color;
}
