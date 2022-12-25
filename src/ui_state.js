import { Camera } from './camera.js';

export class UiState {
    constructor(graphicsWindow) {
        this.graphicsWindow = graphicsWindow;
        this.camera = new Camera();
    }

    setGraphicsWindow(graphicsWindow) {
        this.graphicsWindow = graphicsWindow;
    }

    viewFit() {
        let boundingBox = this.graphicsWindow.boundingBox;
        this.camera.fit(boundingBox.mn, boundingBox.mx);
    }

    zoom(scale, xps, yps) {
        this.camera.zoom(scale, xps, yps);
    }

    rotate(dx, dy) {
        this.camera.rotate(dx, dy);
    }

    viewport() {
        return this.camera.viewport;
    }
}