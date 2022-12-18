import { BodyBuffer } from './glbuffer.js';
import { numpy as np } from '../numpy.js';

const colorRange = [
	[0.0, 0.0, 0.7],
    [0.0, 0.0, 0.9],
    [0.0, 0.25, 1.0],
    [0.0, 0.5, 1.0],
    [0.0, 0.75, 1.0],
    [0.0, 1.0, 1.0],
    [0.25, 1.0, 0.5],
    [0.75, 1.0, 0.25],
    [1.0, 1.0, 0.0],
    [1.0, 0.75, 0.0],
    [1.0, 0.5, 0.0],
    [1.0, 0.25, 0.0],
    [0.75, 0.0, 0.0],
    [0.5, 0.0, 0.0]
];
const shininess = 100;
const numberOfBins = colorRange.length;

export const graphicsOptions = {
	color: [0.0, 0.0, 0.0],
	primitiveSize: 1.0,
	pick: null
}

export class GraphicsBody {
	constructor(bodyBuffer, shaderName, parentFromBody, scalarValues, options) {
		this.bodyBuffer = bodyBuffer;
		this.shaderName = shaderName;
		this.parentFromBody = parentFromBody;
		this.scalarValues = scalarValues;
		this.options = options;
	}
	
	static create(gl, vertices, indices, shaderName, scalarValues, parentFromBody, options) {
		let attribValues = {};
		if (scalarValues !== undefined) {
			attribValues = {
				'scalar_value': scalarValues
			};
		}
		const bodyBuffer = BodyBuffer.create(gl, vertices, attribValues, indices);
		return new GraphicsBody(
			bodyBuffer, shaderName, parentFromBody, scalarValues, { ...graphicsOptions, ...options});
	}
	
	render(gl, locations) {
		if (this.shaderName === "flat" || this.shaderName === "pick") {
			if (this.shaderName === "flat") {
				gl.lineWidth(this.options.primitiveSize);
			}
			gl.uniform3f(locations.color, ...this.options.color);
		}
		else {
			gl.uniform3fv(locations.colorRange, new Float32Array(np.flatten(colorRange)), 0, colorRange.length * 3);
			let min = np.min(this.scalarValues);
			let max = np.max(this.scalarValues);
            gl.uniform1f(locations.minValue, min);
            gl.uniform1f(locations.maxValue, max);
			let colorValues = np.linspace(min, max, numberOfBins + 1);
            gl.uniform1fv(locations.colorValues, new Float32Array(colorValues), 0, colorValues.length);
		}
		BodyBuffer.drawElements(gl, this.bodyBuffer);
	}
}