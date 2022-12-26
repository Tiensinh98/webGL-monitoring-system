import {
	Transformation as T,
	Quaternion,
	Direction,
	Vector
} from './gl/point.js';
import { Numpy as np } from './gl/numpy.js';
import { Vec3 } from './gl/gl_matrix.js';

export class Camera {
	constructor() {
		this.r = new Quaternion();
		this.t = new Vector();
		this.s = 1.0;
		this.viewport = [0, 0, 642, 417];
	}

	eyeFromModel() {
		return new T(this.r, this.t, this.s);
	}

	eyeFromMouse() {
		const [x, y, width, height] = this.viewport;
		return T.fromTranslation([- width / 2, - height / 2, 0]);
	}

	modelFromMouse() {
		return this.eyeFromModel().inv().multiply(this.eyeFromMouse());
	}

	zoom(scale, xps, yps) {
		const [x, y, width, height] = this.viewport;
		const sx = width / 2 - xps;
		const sy = height / 2 - yps;
		let t = T.fromTranslation([sx, sy, 0]);
		let s = T.fromScaling(scale);
		let tInv = T.fromTranslation([-sx, -sy, 0]);
		let ret = tInv.multiply(s).multiply(t).multiply(this.eyeFromModel());
		this.t = ret.t;
		this.s = ret.s;
	}

	rotate(dx, dy, center=[0.0, 0.0, 0.0]) {
		if (dy === 0 && dx === 0) return;
		const height = this.viewport[3];
		const theta = np.hypot(dx, dy) * 4.0 / height;
		let modelDir = this.modelFromMouse().multiply(new Direction(new Vec3(-dy, dx, 0.0)));
		let rotation = T.fromRotation(theta, modelDir, center);
		let ret = this.eyeFromModel().multiply(rotation);
		this.r = ret.r;
		this.t = ret.t;
	}

	fit(bboxMin, bboxMax, scaling=true) {
		let scale;
		if (scaling === true) {
            let radius = np.norm(np.scale(np.subtract(bboxMax, bboxMin), 0.5));
            const [x, y, width, height] = this.viewport;
            if (radius < 1e-20) scale = 1.0;
            else scale = np.min([width, height]) / (radius * 2.0);
		}
		else {
			scale = this.s;
		}
		let s = T.fromScaling(scale);
        let r = new T(this.r);
        let t = T.fromTranslation(np.scale(np.sum([bboxMin, bboxMax], 0), 0.5)).inv();
        let newTransformation = s.multiply(r).multiply(t);
        this.t = newTransformation.t;
        this.s = newTransformation.s;
	}
}