import {
	shaderTypes,
	attribInfos
} from '../shaders.js';

class GLRenderer {
	constructor(x, y, width, height, canvas, programMap) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.canvas = canvas;
		this.programMap = programMap;
		this.render = this.render.bind(this);
	}

	create(gl, canvas) {
		var pMap = {};
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
				const attribs = sType.attribs;
				attribs.forEach(
					(attrib) => {
						gl.bindAttribLocation(shaderProgram, attrib.infos.location, attrib.name);
					}
				)
				let shaderName = sType.name;
				pMap = {
					...pMap,
					shaderName: shaderProgram
				}
			}
		);
		return new GLRenderer(x, y, width, height, canvas, programMap);
	}

	render() {

	}
}