import {
	Transformation as T,
	Quaternion
} from './point.js';
import { numpy as np } from './numpy.js';
import { Vec3 } from './glmatrix.js';

export class Camera {
	constructor() {
		this.r = new Quaternion();
		this.t = new Vec3();
		this.s = 1.0;
		this.viewport = [0, 0, 1920, 1080];
	}

	eyeFromModel() {
		return new T(this.r, this.t, this.s);
	}

	eyeFromMouse() {
		const [x, y, width, height] = this.viewport;
		return T.fromTranslation([- width / 2, - height / 2, 0]);
	}

	modelFromMouse() {
		return T.multiply(this.eyeFromModel.inv(), this.eyeFromMouse());
	}

	zoom(scale, xps, yps) {
		const [x, y, width, height] = this.viewport;
		const sx = width / 2 - x;
		const sy = height / 2 - y;
		let t = T.fromTranslation([xps, yps, 0]);
		let s = T.fromScaling(scale);
		let tInv = T.fromTranslation([-sx, -sy, 0]);
		let ret = tInv.multiply(s).multiply(t).multiply(this.eyeFromModel());
		this.t = ret.t;
		this.s = ret.s;
	}

	rotate(dx, dy, center=[0.0, 0.0, 0.0]) {
		if (dy === 0 && dx === 0) return
		const height = this.viewport[3];
		const theta = np.hypot(dx, dy) * 4.0 / height;
		var t = this.modelFromMouse().multiply(T.fromTranslation([-dy, dx, 0.0]));
		var r = T.fromRotation(theta, t.t.vec, center);
		var ret = this.eyeFromModel().multiply(r);
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