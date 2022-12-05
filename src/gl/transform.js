import {
    quat, vec3, 
    mat3, mat4
} from 'gl-matrix';

class Transformation {
    constructor(r, t, s) {
        this.r = r; 
        this.t = t; 
        this.s = s;
    }
    
    matrix() {
        var m = mat4.create();
        
    }
}

export var T = Transformation;

