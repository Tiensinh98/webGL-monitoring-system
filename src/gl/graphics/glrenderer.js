import {
	shaderTypes
} from '../shaders.js';
import { GLTransformation } from './gltransformation.js';

export class GLRenderer {
	constructor(x, y, width, height, canvas, programMap) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.canvas = canvas;
		this.programMap = programMap;
	}

	static create(x, y, width, height, gl, canvas) {
		let programMap = {};
		shaderTypes.forEach(
			(sType) => {
				const vertexShader = loadShader(gl, gl.VERTEX_SHADER, sType.vertex);
				const fragShader = loadShader(gl, gl.FRAGMENT_SHADER, sType.fragment);
				const shaderProgram = gl.createProgram();
				gl.attachShader(shaderProgram, vertexShader);
				gl.attachShader(shaderProgram, fragShader);
				gl.linkProgram(shaderProgram);
				if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
					alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
					return null;
				}
				gl.bindAttribLocation(shaderProgram, 0, 'vertex');
				sType.attribs.forEach(
					(attrib) => {
						gl.bindAttribLocation(shaderProgram, attrib.infos.location, attrib.name);
					}
				)
				programMap[sType.name] = shaderProgram;
			}
		)
		return new GLRenderer(x, y, width, height, canvas, programMap);
	}

	freeBuffers(gl, width, height) {
		gl.viewport(0, 0, width, height);
	}

	render(gl, camera, graphicsBody) {
		this.freeBuffers(gl, this.canvas.width, this.canvas.height);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.depthMask(gl.TRUE);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		const eyeFromModel = camera.eyeFromModel();
		const [x, y, width, height] = camera.viewport;
		gl.viewport(x, y, width, height);
		let transformation = GLTransformation.create(
			width, height, eyeFromModel, graphicsBody.bodyBuffer.boundingBox.getScaled(1.10));
		const program = this.programMap[graphicsBody.shaderName];
		gl.useProgram(program);
		const locations = getShaderLocations(gl, program);
		gl.uniformMatrix4fv(locations.ndcFromEye, false, transformation.ndcFromEye.mat);
		gl.uniformMatrix4fv(locations.eyeFromLocal, false, eyeFromModel.matrix().mat);
		graphicsBody.render(gl, locations);
		gl.useProgram(null);
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

const getShaderLocations = (gl, shaderProgram) => {
	let locations = {
		ndcFromEye: gl.getUniformLocation(shaderProgram, 'ndc_from_eye'),
		eyeFromLocal: gl.getUniformLocation(shaderProgram, 'eye_from_local'),
		color: gl.getUniformLocation(shaderProgram, 'color'),
		minValue: gl.getUniformLocation(shaderProgram, 'min_value'),
        maxValue: gl.getUniformLocation(shaderProgram, 'max_value'),
        colorValues: gl.getUniformLocation(shaderProgram, 'color_values'),
        colorRange: gl.getUniformLocation(shaderProgram, 'color_range'),
	};
	return locations;
}