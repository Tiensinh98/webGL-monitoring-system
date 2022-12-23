import { GraphicsBody } from '../graphics_item.js';
import { Mat4 } from '../../gl_matrix.js';
import { Numpy as np } from '../../numpy.js';

export class ComponentLayer {
    constructor(gl) {
        let vertices;
        let values;
        let indices;
        let edgeIndices;
        np.load("./impeller_mesh/vertices.txt", parseFloat, 3, (err, data) => {
                vertices = data;
            }
        );
        np.load("./impeller_mesh/scalar_values.txt", parseFloat, 1, (err, data) => {
                values = data;
            }
        );
        np.load("./impeller_mesh/indices.txt", parseInt, 3, (err, data) => {
                indices = data;
            }
        )
        np.load("./edge_indices.txt", parseInt, 2, (err, data) => {
                edgeIndices = data;
            }
        )
        debugger;
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