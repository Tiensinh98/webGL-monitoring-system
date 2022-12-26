import {
	vec3, mat4,
	quat, vec4
} from 'gl-matrix';
import { Numpy as np } from './numpy.js';


export class Vec3 {
	constructor(v1, v2, v3) {
		this.v = vec3.fromValues(
			v1 ===undefined ? 0.0: v1, 
			v2 ===undefined ? 0.0: v2, 
			v3 ===undefined ? 0.0: v3
		);
	}

	*[Symbol.iterator]() {
        for (let i = 0; i < this.v.length; i++) {
        	yield this.v[i];
        }
    }

	dot(other) {
		let ret = vec3.dot(this.v, other.v);
		return ret;
	}

	add(other) {
		let ret = vec3.create();
		vec3.add(ret, this.v, other.v);
		return new Vec3(...ret);
	}

	subtract(other) {
		let ret = vec3.create();
		vec3.subtract(ret, this.v, other.v);
		return new Vec3(...ret);
	}

	scale(s) {
		let ret = vec3.create();
		vec3.scale(ret, this.v, s);
		return new Vec3(...ret);
	}

	normalize() {
		let ret = vec3.create();
		vec3.normalize(ret, this.v);
		return new Vec3(...ret);
	}

	cross(other) {
		let ret = vec3.create();
		vec3.cross(ret, this.v, other.v);
		return new Vec3(...ret);
	}

	negate() {
		let ret = vec3.create();
		vec3.negate(ret, this.v);
		return new Vec3(...ret);
	}

	get(index) {
		if (index < 0 || index > this.v.length - 1) return null;
		return this.v[index];
	}
}


export class Mat4 {
	constructor(mat) {
		let matrix;
		if (Array.isArray(mat)) {
			matrix = mat4.fromValues(...np.flatten(mat));
		}
		else if (mat === undefined) {
			matrix = mat4.create();
		}
		else {
			matrix = mat;
		}
		this.mat = matrix;
	}

	static create(mat) {
		return new Mat4(mat);
	}

	static ortho(left, right, bottom, top, near, far) {
		let ret = mat4.create();
		mat4.ortho(ret, left, right, bottom, top, near, far);
		return new Mat4(ret);
	}

	transpose() {
		let m = mat4.create();
		mat4.transpose(m, m);
		return new Mat4(m);
	}

	multiply(other) {
		let m = mat4.create();
		mat4.multiply(m, other.mat, this.mat);
		return new Mat4(m);
	}

	set(row, col, value) {
		this.mat[row * 4 + col] = value;
	}
}

export class Quat {
	constructor(qx, qy, qz, qw) {
		this.q = quat.fromValues(
			qx ===undefined ? 0.0: qx,
			qy ===undefined ? 0.0: qy,
			qz ===undefined ? 0.0: qz,
			qw ===undefined ? 0.0: qw
		);
	}

	*[Symbol.iterator]() {
        for (let i = 0; i < this.q.length; i++) {
        	yield this.q[i];
        }
    }

	normalize() {
		let q = quat.create();
		quat.normalize(q, this.q);
		return new Quat(...q);
	}

	negate() {
		let q = quat.create();
		vec4.negate(q, this.q);
		let ret = new Quat();
		ret.q = q;
		return ret;
	}
}