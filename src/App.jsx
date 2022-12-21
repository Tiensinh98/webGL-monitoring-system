import React from 'react';
import Canvas from './components/canvas/Canvas';
import { UiState } from './ui_state.js';
import { ComponentGraphicsWindow } from './gl/graphics/graphics_windows/component_graphics_windows.js';

export default function App() {
    var gl;

    function getGLContext(context) {
        gl = context; 
    }

    function getUiState() {
        return new UiState(new ComponentGraphicsWindow(gl));
    }

    return <Canvas
        uiState={getUiState}
        getGLContext={getGLContext}/>;
}