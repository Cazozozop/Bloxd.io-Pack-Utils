/* BSL Shaders v8 Series by Capt Tatsu */
#ifdef FSH
varying vec2 texCoord;
varying vec3 upVec, sunVec;
varying vec4 color;

uniform sampler2D texture;

void main() {
    vec4 albedo = texture2D(texture, texCoord);
    gl_FragColor = albedo; // Simple output for demonstration
}
#endif
