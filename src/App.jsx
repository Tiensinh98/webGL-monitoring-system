import React from 'react';
import Canvas from './components/canvas/Canvas';
import ToolBar from './components/canvas/ToolBar';

import { UiState } from './ui_state.js';
import { Numpy as np} from './gl/numpy.js';
import { ComponentGraphicsWindow } from './gl/graphics/graphics_windows/component_graphics_windows.js';

export default function App() {
    var gl;
    var uiState;
    var meshInfo = {
        vertices: null,
        scalarValues: null,
        indices: null,
        edgeIndices: null,
    };
    function getGLContext(context) {
        gl = context; 
    }

    function getUiState() {
        uiState = new UiState(null);
        return uiState;
    }

    function readMeshFile(input, func, size) {
        let target = input.target;
        let file = target.files[0];
        let name = target.name;
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            let data = np.load(reader.result, func, size);
            meshInfo[name] = data;
            let setMeshInfo = new Set(Object.values(meshInfo));
            console.log(meshInfo)
            if (!setMeshInfo.has(null)) {
                uiState.setGraphicsWindow(new ComponentGraphicsWindow(gl, meshInfo));
            }
        };
        reader.onerror = function() {
            console.log(reader.error);
        };
    }

    return (<div>
                <ToolBar readMeshFile={readMeshFile}/>
                <Canvas uiState={getUiState} getGLContext={getGLContext}/>;
            </div>
    );
}