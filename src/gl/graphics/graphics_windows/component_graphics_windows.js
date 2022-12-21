import { ComponentLayer } from '../graphics_layers/component_layer.js';

export class ComponentGraphicsWindow {
    constructor(gl) {
        this.componentLayer = new ComponentLayer(gl);
        this.boundingBox = this.componentLayer.boundingBox;
    }

    graphicsLayers() {
        return [
            this.componentLayer
        ];
    }
}