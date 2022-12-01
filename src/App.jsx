import React from 'react';
import Canvas from './components/canvas/Canvas';
import {
    flatVertex, 
    flatFrag 
} from './gl/shaders.js';

export default function App() {
    const vertices = [
        1.0,  1.0, 0.0, 
       -1.0 ,  1.0, 0.0,
       -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0,
        1.0, 1.0, 1.0,
       -1.0,  1.0, 5.0,
       -1.0, -1.0, 5.0,
        1.0, -1.0, 5.0
    ];
    const values = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
    const indices = [
        0, 1, 2,
        0, 2, 3,
        4, 0, 3,
        4, 3, 7,
        5, 4, 7,
        5, 7, 6,
        1, 2, 6,
        1, 6, 5,
        2, 3, 7,
        2, 7, 6,
        1, 0, 4,
        1, 4, 5
    ]
    const colorRange = [
        0.0, 0.0, 0.7,
        0.0, 0.0, 0.9,
        0.0, 0.25, 1.0,
        0.0, 0.5, 1.0,
        0.0, 0.75, 1.0,
        0.0, 1.0, 1.0,
        0.25, 1.0, 0.5,
        0.75, 1.0, 0.25,
        1.0, 1.0, 0.0,
        1.0, 0.75, 0.0,
        1.0, 0.5, 0.0,
        1.0, 0.25, 0.0,
        0.75, 0.0, 0.0,
        0.5, 0.0, 0.0
    ]
    return <Canvas 
        vertices={vertices} 
        indices={indices}
        values={values}
        vertShader={flatVertex}
        fragShader={flatFrag}
        colorRange={colorRange}/>;
}