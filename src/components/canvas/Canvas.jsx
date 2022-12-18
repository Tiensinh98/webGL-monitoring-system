import React from 'react';
import { GLRenderer } from '../../gl/graphics/glrenderer.js';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        let [x, y, width, height] = this.props.camera.viewport;
        this.state = {
            x: x,
            y: y,
            width: width,
            height: height
        };
        this.canvasRef = React.createRef();
        this.handleResizeEvent = this.handleResizeEvent.bind(this);
        this.handleMouseMoveEvent = this.handleMouseMoveEvent.bind(this);
        this.handleWheelEvent = this.handleWheelEvent.bind(this);
        this.resizeGL = this.resizeGL.bind(this);
        window.addEventListener("resize", this.handleResizeEvent);
    }

    resizeGL(width, height) {
        // console.log(`resize (${width}, ${height})`);
        // var canvas = this.canvasRef.current;
        // const gl = canvas.getContext('webgl2');
        // gl.clearColor(1.0, 1.0, 1.0, 1.0);
        // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        // const aspect = this.state.width / this.state.height;
        // gl.useProgram(this.programInfo.program);
        // var projMat = mat4.create();
        // const diag = Math.sqrt(3);
        // mat4.ortho(projMat, -aspect * diag, aspect * diag, -diag, diag, -1000, 1000);
        // const uniformLocs = this.programInfo.uniformLocations;
        // const viewMat = mat4.create();
        // gl.uniformMatrix4fv(uniformLocs.projection, false, projMat);
        // gl.uniformMatrix4fv(uniformLocs.model_view, false, viewMat);
        // gl.useProgram(null);
    }

    handleResizeEvent() {
        // const width = window.innerWidth;
        // const height = window.innerHeight;
        // this._resizeGL(width, height);
        // // handle resizeGL before rerendering
        // this.setState((preState) => {
        //     var newState = {...preState};
        //     newState.width = width;
        //     newState.height = height;
        //     return newState;
        // });
    }

    handleWheelEvent(event) {
        var sx = event.deltaY / 1000;
        this.setState((preState) => {
            var newState = {...preState};
            newState.scale += sx;
            return newState;
        })
    }

    handleMouseMoveEvent(event) {
        console.log("mouseMove " + event);
    }

    handleMouseDownEvent(event) {
        console.log("mouseDown " + event);
    }

    componentDidUpdate() {
        console.log("Updating...");
        var canvas = this.canvasRef.current;
        const gl = canvas.getContext('webgl2');
        this.glRenderer.render(gl, this.props.camera, this.graphicsBody);
    }

    componentDidMount() {
        console.log("initializeGL ");
        var canvas = this.canvasRef.current;
        this.state = {
            width: canvas.width,
            height: canvas.height
        }
        const gl = canvas.getContext('webgl2');
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        this.graphicsBody = this.props.createGraphicsBody(gl);
        let { x, y, width, height } = this.state;
        this.glRenderer = GLRenderer.create(x, y, width, height, gl, this);
    }

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                width={this.state.width}
                height={this.state.height}
                onWheel={this.handleWheelEvent}
                onMouseMove={this.handleMouseMoveEvent}
                onMouseDown={this.handleMouseDownEvent}>
            </canvas>
        );
    }
}
