import React from 'react';
import Canvas from './components/canvas/Canvas';
import { GraphicsBody } from './gl/graphics/graphicsitem.js';
import { Camera } from './gl/camera.js';

export default function App() {
    const vertices = [
        [1.0,  1.0, 0.0], 
        [-1.0 ,  1.0, 0.0],
        [-1.0, -1.0, 0.0],
        [1.0, -1.0, 0.0],
        [1.0, 1.0, 1.0],
        [-1.0,  1.0, 5.0],
        [-1.0, -1.0, 5.0],
        [1.0, -1.0, 5.0]
    ];
    const values = [0.7, 0.2, 0.3, 0.0, 0.5, 0.43, 0.7, 0.1];
    const indices = [
        [0, 1, 2],
        [0, 2, 3],
        [4, 0, 3],
        [4, 3, 7],
        [5, 4, 7],
        [5, 7, 6],
        [1, 2, 6],
        [1, 6, 5],
        [2, 3, 7],
        [2, 7, 6],
        [1, 0, 4],
        [1, 4, 5]
    ]
    let camera = new Camera();
    let createGraphicsBody = (gl) => {
        let graphicsBody = GraphicsBody.create(
            gl, vertices, indices, 'flat', undefined, undefined, {});
        return graphicsBody;
    }
    return <Canvas
        camera={camera}
        createGraphicsBody={createGraphicsBody}/>;
}