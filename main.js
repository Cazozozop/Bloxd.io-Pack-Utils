const canvas = document.getElementById('myCanvas');
const gl = canvas.getContext('webgl');

// Ajuste la taille du canevas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fonction pour charger les shaders
async function loadShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not load shader at ${url}`);
    }
    return await response.text();
}

// Créer un programme shader
function createShaderProgram(vertexSource, fragmentSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    checkShaderCompile(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    checkShaderCompile(fragmentShader);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    return shaderProgram;
}

// Vérifie la compilation des shaders
function checkShaderCompile(shader) {
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        const info = gl.getShaderInfoLog(shader);
        console.error('Erreur de compilation du shader: ' + info);
    }
}

// Initialiser les shaders
async function initShaders() {
    const vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }`;
    
    const skybasicFragmentShader = await loadShader('shaders/skybasic.glsl');
    const skytexturedFragmentShader = await loadShader('shaders/skytextured.glsl');

    const skybasicProgram = createShaderProgram(vertexShaderSource, skybasicFragmentShader);
    const skytexturedProgram = createShaderProgram(vertexShaderSource, skytexturedFragmentShader);

    // Utiliser l'un des programmes pour le rendu
    render(skybasicProgram);
}

// Rendu
function render(program) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.useProgram(program);
    
    // Définir la position des sommets pour un carré simple
    const positions = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Dessiner le carré
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// Initialisation
initShaders().catch(err => console.error(err));
