(function() {

var canvas = document.getElementById("c"); //Getting canvas from page

var gl = canvas.getContext("webgl"); //Getting context from canvas for webgl
if (!gl) {
    alert("no webgl for you!");
} else {
    console.log("WebGl Running!");
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type); //Create shader
    gl.shaderSource(shader, source);    //Add text to shader
    gl.compileShader(shader);           //Compile shader

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS); //Check that it compled successfully
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

//Get shader text from page
var vertexShaderSource = document.getElementById("2d-vertex-shader").text;
var fragmentShaderSource = document.getElementById("2d-fragment-shader").text;

//Compile shaders
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

//Calling program
var program = createProgram(gl, vertexShader, fragmentShader);

//Getting uniform from program (from vertex shader)
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");

//Getting attribute from program (from vertex shader)
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

//Attributes get their data from buffers so we need to create a buffer
var positionBuffer = gl.createBuffer();

//First you bind a resource to a bind point. Then, all other functions refer to the resource through the bind point. 
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// three 2d points
var positions = [
    0, 0,
    100, 100,
    200, 0,
];
            //Points to pos-buffer //Strictly convert to f32 //Draw 1 time 
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

webglUtils.resizeCanvasToDisplaySize(gl.canvas);

//This tells WebGL the -1 +1 clip space maps to 0 <-> gl.canvas.width for x and 0 <-> gl.canvas.height for y
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// set the resolution
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

//var primitiveType = gl.TRIANGLES;
//var offset = 0;
//var count = 3;
//gl.drawArrays(primitiveType, offset, count);

// draw 50 random rectangles in random colors
for (var ii = 0; ii < 50; ++ii) {
    // Setup a random rectangle
    // This will write to positionBuffer because
    // its the last thing we bound on the ARRAY_BUFFER
    // bind point
    setRectangle(
        gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

    // Set a random color.
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
})();

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
    return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,
       x1, y2,
       x2, y1,
       x2, y2,
    ]), gl.STATIC_DRAW);
}