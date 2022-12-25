import { ComponentLayer } from '../graphics_layers/component_layer.js';

export class ComponentGraphicsWindow {
    constructor(gl, meshInfo) {
        const { vertices, scalarValues, indices, edgeIndices } = meshInfo;
        this.componentLayer = new ComponentLayer(gl, vertices, scalarValues, indices, edgeIndices);
        this.boundingBox = this.componentLayer.boundingBox;
    }

    graphicsLayers() {
        return [
            this.componentLayer
        ];
    }
}