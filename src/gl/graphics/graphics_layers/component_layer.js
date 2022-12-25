import { GraphicsBody } from '../graphics_item.js';
import { Mat4 } from '../../gl_matrix.js';

export class ComponentLayer {
    constructor(gl, vertices, values, indices, edgeIndices) {
        this.graphicsBody = GraphicsBody.create(gl, vertices, indices, 'scalarField', values, Mat4.create());
        this.edgeGraphicsBody = GraphicsBody.create(gl, vertices, edgeIndices, 'flat', undefined, Mat4.create());
        this.boundingBox = this.graphicsBody.bodyBuffer.boundingBox;
    }

    graphicsBodies() {
        return [
            this.graphicsBody,
            this.edgeGraphicsBody
        ];
    }
}