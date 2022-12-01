import React from 'react';
import {vec3, quat, mat4} from 'gl-matrix';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 700,
            height: 600,
            scale: 1.0
        };
        this.canvasRef = React.createRef();
        this._handleResizeEvent = this._handleResizeEvent.bind(this);
        this._handleMouseMoveEvent = this._handleMouseMoveEvent.bind(this);
        this._handleWheelEvent = this._handleWheelEvent.bind(this);
        this._resizeGL = this._resizeGL.bind(this);
        window.addEventListener("resize", this._handleResizeEvent);
    }

    _resizeGL(width, height) {
        console.log(`resize (${width}, ${height})`);
        var canvas = this.canvasRef.current;
        const gl = canvas.getContext('webgl2');
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        const aspect = this.state.width / this.state.height;
        gl.useProgram(this.programInfo.program);
        var projMat = mat4.create();
        const diag = Math.sqrt(3);
        mat4.ortho(projMat, -aspect * diag, aspect * diag, -diag, diag, -1000, 1000);
        const uniformLocs = this.programInfo.uniformLocations;
        const viewMat = mat4.create();
        gl.uniformMatrix4fv(uniformLocs.projection, false, projMat);
        gl.uniformMatrix4fv(uniformLocs.model_view, false, viewMat);
        gl.useProgram(null);
    }

    _handleResizeEvent() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this._resizeGL(width, height);
        // handle resizeGL before rerendering
        this.setState((preState) => {
            var newState = {...preState};
            newState.width = width;
            newState.height = height;
            return newState;
        });
    }

    _handleWheelEvent(event) {
        var sx = event.deltaY / 1000;
        this.setState((preState) => {
            var newState = {...preState};
            newState.scale += sx;
            return newState;
        })
    }

    _handleMouseMoveEvent(event) {
        console.log("mouseMove " + event);
    }

    _handleMouseDownEvent(event) {
        console.log("mouseDown " + event);
    }

    componentDidUpdate() {
        console.log("Updating...");
        var canvas = this.canvasRef.current;
        const gl = canvas.getContext('webgl2');
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.depthMask(gl.TRUE);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(this.programInfo.program);
        const aspect = this.state.width / this.state.height;
        var projMat = mat4.create();
        const diag = Math.sqrt(3);
        mat4.ortho(projMat, -aspect * diag, aspect * diag, -diag, diag, -1000, 1000);
        const uniformLocs = this.programInfo.uniformLocations;
        const attribLocs = this.programInfo.attribLocations;
        gl.uniformMatrix4fv(uniformLocs.projection, false, projMat);
        var viewMat = mat4.create();
        mat4.scale(viewMat, viewMat, vec3.fromValues(this.state.scale, this.state.scale, this.state.scale));
        mat4.translate(viewMat, viewMat, vec3.fromValues(0.0, 0.0, - diag));
        mat4.rotate(viewMat, viewMat, Math.PI / 4, vec3.fromValues(0.0, 0.0, 1.0));
        gl.uniformMatrix4fv(uniformLocs.model_view, false, viewMat);
        gl.uniform3f(uniformLocs.color, 0.4, 1.0, 0.7);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertex);
        gl.enableVertexAttribArray(attribLocs.vertex);
        gl.vertexAttribPointer(attribLocs.vertex, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indice);
        gl.drawElements(gl.TRIANGLES, this.props.indices.length, gl.UNSIGNED_SHORT, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.useProgram(null);
    }

    componentDidMount() {
        console.log("initializeGL ");
        var canvas = this.canvasRef.current;
        this.state = {
            width: canvas.width,
            height: canvas.height
        }
        const gl = canvas.getContext('webgl2');
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        const vertextShader = loadShader(gl, gl.VERTEX_SHADER, this.props.vertShader);
        const fragShader = loadShader(gl, gl.FRAGMENT_SHADER, this.props.fragShader);
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertextShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }
        gl.bindAttribLocation(shaderProgram, 0, 'vertex');
        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertex: gl.getAttribLocation(shaderProgram, 'vertex')
            },
            uniformLocations: {
                projection: gl.getUniformLocation(shaderProgram, 'projection'),
                model_view: gl.getUniformLocation(shaderProgram, 'model_view'),
                color: gl.getUniformLocation(shaderProgram, 'color')
            }
        };
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        var vertexBuffer = generateBuffer(gl, this.props.vertices, gl.ARRAY_BUFFER);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        var indiceBuffer = generateBuffer(gl, this.props.indices, gl.ELEMENT_ARRAY_BUFFER);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
        this.buffers = {
            vertex: vertexBuffer,
            indice: indiceBuffer,
        }
    }

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                width={this.state.width}
                height={this.state.height}
                onWheel={this._handleWheelEvent}
                onMouseMove={this._handleMouseMoveEvent}
                onMouseDown={this._handleMouseDownEvent}>
            </canvas>
        );
    }
}


const loadShader= (gl, shaderType, shaderSource) => {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}


const generateBuffer = (gl, array, target) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    var srcData = new Float32Array(array);
    if (target == gl.ELEMENT_ARRAY_BUFFER) {
        srcData = new Uint16Array(array);
    }
    gl.bufferData(target, srcData, gl.STATIC_DRAW);
    return buffer;
}