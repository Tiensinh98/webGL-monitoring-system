import { vertexLoction, attribInfos } from '../shaders.js';
import { numpy as np } from '../numpy.js';
import { BoundingBox } from '../boundingbox.js';

var buffersToDelete = [];
var vaosToDelete = [];

export var freeBuffers = () => {
    
}

class Buffer {
    constructor(buffer, length, target, type, attribInfo) {
        this.buffer = buffer;
        this.length = length;
        this.target = target;
        this.type = type;
        this.attribInfo = attribInfo;
    }

    static create(gl, array, target, attribInfo) {
        const buffer = gl.createBuffer(1);
        gl.bindBuffer(target, buffer);
        var srcData = new Float32Array(array);
        var type = gl.FLOAT;
        if (target == gl.ELEMENT_ARRAY_BUFFER) {
            srcData = new Uint16Array(array);
            type = gl.UNSIGNED_SHORT;
        }
        gl.bufferData(target, srcData, gl.STATIC_DRAW);
        gl.bindBuffer(target, null);
        return new Buffer(buffer, array.length, target, type, attribInfo);
    }
}

export class BodyBuffer {
    constructor(vertexBuffer, attribBuffers, indiceBuffer, vao, primitiveMode, boundingBox) {
        this.vertexBuffer = vertexBuffer;
        this.attribBuffers = attribBuffers;
        this.indiceBuffer = indiceBuffer;
        this.vao = vao;
        this.primitiveMode = primitiveMode;
        this.boundingBox = boundingBox;
    }

    static create(gl, verties, attribValues, indices) {
        const boundingBox = BoundingBox.create(verties);
        const vertexBuffer = Buffer.create(gl, np.flatten(verties), gl.ARRAY_BUFFER);
        let attribBuffers = {};
        for (const [key, values] of Object.entries(attribValues)) {
            attribBuffers[key] = Buffer.create(gl, values, gl.ARRAY_BUFFER, attribInfos[key]);
        }
        let primitiveMode;
        let shapeIndices = np.getShape(indices);
        if (shapeIndices.length === 1) {
            primitiveMode = gl.POINTS;
        }
        else {
            if (shapeIndices[1] === 1) primitiveMode = gl.POINTS;
            else if (shapeIndices[1] === 2) primitiveMode = gl.LINES;
            else primitiveMode = gl.TRIANGLES;
        }
        const indicesBuffer = Buffer.create(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.buffer);
        gl.enableVertexAttribArray(vertexLoction);
        gl.vertexAttribPointer(vertexLoction, 3, vertexBuffer.type, false, 0, 0);

        for (const [attribName, attribBuffer] of Object.entries(attribBuffers)) {
            gl.bindBuffer(attribBuffer.target, attribBuffer.buffer);
            gl.enableVertexAttribArray(attribInfos[attribName].location);
            gl.vertexAttribPointer(
                attribInfos[attribName].location, attribInfos[attribName].nComponent, attribBuffer.type, false, 0, 0);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer.buffer);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return new BodyBuffer(vertexBuffer, attribBuffers, indicesBuffer, vao, primitiveMode, boundingBox);
    }

    static drawElements(gl, bodyBuffer) {
        gl.bindVertexArray(bodyBuffer.vao);
        gl.drawElements(
            bodyBuffer.primitiveMode, bodyBuffer.indiceBuffer.length, bodyBuffer.indiceBuffer.type, 0);
        gl.bindVertexArray(null);
    }
}