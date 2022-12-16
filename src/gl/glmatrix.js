import {
	vec3, mat4,
	quat, vec4
} from 'gl-matrix';

import { numpy as np } from './numpy.js';


export default class Vec3 {
	constructor(vec) {
		if (vec === undefined) vec = [0.0, 0.0, 0.0];
		this.vec = vec3.fromValues(...vec);
	}

	add(other) {
		let ret = vec3.create();
		vec3.add(ret, this.vec, other.vec);
		return new Vec3(ret);
	}

	subtract(other) {
		let ret = vec3.create();
		vec3.subtract(ret, this.vec, other.vec);
		return new Vec3(ret);
	}

	scale(s) {
		let ret = vec3.create();
		vec3.scale(ret, this.vec, s);
		return new Vec3(ret);
	}

	normalize() {
		let ret = vec3.create();
		vec3.normalize(ret, this.vec);
		return new Vec3(ret);
	}

	dot(other) {
		let ret = vec3.dot(this.vec, other.vec);
		return ret;
	}

	cross(other) {
		let ret = vec3.create();
		vec3.cross(ret, this.vec, other.vec);
		return new Vec3(ret);
	}
}

export class Vec4 {
	constructor(vec) {
		this.vec = vec4.fromValues(...vec);
	}

	add(other) {
		let ret = vec4.create();
		vec4.add(ret, this.vec, other.vec);
		return new Vec4(ret);
	}

	subtract(other) {
		let ret = vec4.create();
		vec4.subtract(ret, this.vec, other.vec);
		return new Vec4(ret);
	}

	scale(s) {
		let ret = vec4.create();
		vec4.scale(ret, this.vec, s);
		return new Vec4(ret);;
	}
}

export class Mat4 {
	constructor(mat) {
		this.mat = mat4.fromValues(...np.flatten(mat));
	}

	transpose() {
		let m = mat4.create();
		mat4.transpose(m, m);
		return new Mat4(np.fromMat(m));
	}

	multiply(other) {
		let m = mat4.create();
		mat4.multiply(m, this.mat, other.mat);
		return new Mat4(np.fromMat(m));
	}
}

export class Quat {
	constructor(qvec) {
		this.length = qvec.length;
		this.qvec = quat.fromValues(...qvec);
	}

	values() {
		return [...this.qvec] 
	}

	normalize() {
		let quat = quat.create();
		quat.normalize(quat, this.qvec);
		return new Quat(quat);
	}

	negate() {
		let quat = quat.create();
		vec4.negate(quat, this.qvec);
		return new Quat(quat);
	}
}