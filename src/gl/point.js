import {
	vec3, mat4,
	quat
} from 'gl-matrix';

export default class Transformation {
	constructor(rotation, translation, scale) {
		this.rotation = rotation;
		this.translation = translation;
		this.scale = scale;
		this.toMatrix = this.toMatrix.bind(this);
	}

	create() {
		return new Transformation(quat.create(), vec3.create(), 1.0);
	}

	toMatrix() {
		const r = mat4.fromQuat(this.rotation);
		const t = mat4.fromTranslation(this.translation);
		const s = mat4.fromScaling(this.scale);
		var ret = mat4.create();
		mat4.multiply(ret, s);
		mat4.multiply(ret, t);
		mat4.multiply(ret, r);
		return ret;
	}

	fromMatrix(m) {
		var r = quat.create();
		var t = vec3.create();
		var s = 1.0;
		return new Transformation(r, t, s);
	}

	fromRotation(angle, axis, center) {
		var t = vec3.create();
		vec3.subtract(t, vec3.create(), center)
		var r = quat.create();
		quat.setAxisAngle(r, axis, angle)

		return new Transformation(r, t, 1.0);

	}

	fromTranslation(dir) {
		return new Transformation(quat.create(), dir, 1.0);
	}

	fromScaling(s) {
		return new Transformation(quat.create(), vec3.create(), s);
	}

	multiply(thisM, otherM) {
		const m = other.toMatrix();
		var ret = thisM.toMatrix();
		mat4.multiply(ret, m);
		return Transformation.fromMatrix(ret);
	}
}




