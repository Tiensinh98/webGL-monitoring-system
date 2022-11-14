import React from 'react';
import { useRef, useEffect } from 'react';

function Canvas() {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');
        gl.clearColor(0.6, 0.5, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
      }, [])


    return <canvas ref={canvasRef}></canvas>;
}

export default Canvas;