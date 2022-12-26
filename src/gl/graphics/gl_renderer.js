import {
	shaderTypes
} from '../shaders.js';
import { GLTransformation } from './gl_transformation.js';

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

	freeBuffers(gl, x, y, width, height) {
		this.x = x; 
		this.y = y;
		this.width = width; 
		this.height = height;
		gl.viewport(0, 0, width, height);
	}

	render(gl, x, y, width, height, eyeFromModel, graphicsLayers) {
		this.freeBuffers(gl, x, y, width, height);
		gl.clearColor(1.0, 1.0, 1.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		graphicsLayers.forEach(graphicsLayer => {
			let graphicsBodies = graphicsLayer.graphicsBodies();
			let transformation = GLTransformation.create(
				width, height, eyeFromModel, graphicsLayer.boundingBox.getScaled(1.10));
			debugger;
			graphicsBodies.forEach(graphicsBody => {
				const program = this.programMap[graphicsBody.shaderName];
				gl.useProgram(program);
				const locations = getShaderLocations(gl, program);
				gl.uniformMatrix4fv(locations.ndcFromEye, gl.TRUE, transformation.ndcFromEye.mat);
				gl.uniformMatrix4fv(locations.eyeFromLocal, gl.TRUE, eyeFromModel.matrix().mat);
				gl.uniform1i(locations.discreteColors, this.canvas.state.isDescreteColors);
				graphicsBody.render(gl, locations);
				gl.useProgram(null);
			})
		})
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
        discreteColors: gl.getUniformLocation(shaderProgram, 'is_discrete_colors'),
	};
	return locations;
}