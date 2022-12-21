import React from 'react';
import { GLRenderer } from '../../gl/graphics/gl_renderer.js';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.lastMousePosition = [0, 0];
        this.button = 0;
        this.state = {};
        this.canvasRef = React.createRef();
        this.handleViewFit = this.handleViewFit.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
        this.handleRotate = this.handleRotate.bind(this);
    }

    componentDidUpdate() {
        console.log('Updating...');
        const canvas = this.canvasRef.current;
        const gl = canvas.getContext('webgl2');
        const [x, y, width, height] = this.uiState.viewport();
        let eyeFromModel = this.uiState.camera.eyeFromModel();
        let graphicsLayers = this.uiState.graphicsWindow.graphicsLayers();
        this.glRenderer.render(gl, x, y, width, height, eyeFromModel, graphicsLayers);
    }

    componentDidMount() {
        var canvas = this.canvasRef.current;
        const gl = canvas.getContext('webgl2');
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        this.props.getGLContext(gl);
        this.uiState = this.props.uiState();
        const [x, y, width, height] = this.uiState.viewport();
        this.glRenderer = GLRenderer.create(x, y, width, height, gl, this);
        this.setState({
            x: x,
            y: y,
            width: width,
            height: height
        });
    }

    handleViewFit() {
        this.uiState.viewFit();
        this.setState(prevState => prevState);
    }

    handleZoom(event) {
        let scale = event.deltaY / 2000;
        this.uiState.zoom(1.0 + scale, this.state.width / 2, this.state.height / 2);
        this.setState(prevState => prevState);
    }

    handleRotate(event) {
        if (this.button === 1) {
            const [screenX, screenY] = this.lastMousePosition;
            const dx = event.screenX - screenX;
            const dy = screenY - event.screenY;
            this.uiState.rotate(dx, dy);
            this.setState(prevState => prevState);
        }
        this.lastMousePosition = [event.screenX, event.screenY];
    }

    render() {
        return (
            <div>
                <button onClick={this.handleViewFit}>View Fit</button>
                <canvas
                    ref={this.canvasRef}
                    width={this.state.width ? this.state.width : 642}
                    height={this.state.height ? this.state.height : 417}
                    onWheel={this.handleZoom}
                    onMouseDown={(event) => {
                        this.lastMousePosition = [event.screenX, event.screenY];
                        this.button = event.button;
                        }
                    }
                    onMouseMove={this.handleRotate}
                    onMouseUp={() => {
                        this.button = 0;
                        }
                    }
                >
                </canvas>
            </div>
        );
    }
}