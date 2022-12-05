import {
	mat4, quat, vec3
} from 'gl-matrix';

import Transformation from './point.js'

export default class Camera {
	constructor() {
		this.transR = quat.create();
		this.transT = vec3.create();
		this.transS = 1.0;
		this.viewport = [0, 0, 500, 500];
		this.fit = this.fit.bind(this);
		this.rotate = this.rotate.bind(this);
		this.pan = this.pan.bind(this);
		this.zoom = this.zoom.bind(this);
		this.getEyeFromModel = this.getEyeFromModel.bind(this);
		this.getModelFromMouse = this.getModelFromMouse.bind(this);
	}

	getEyeFromModel() {
		return new Transformation(this.transR, this.transT, this.transS);
	}

	getEyeFromMouse() {
		const [x, y, width, height] = this.viewport;
		return Transformation.fromTranslation(vec3.fromValues(-width / 2, -height / 2, 0));
	}

	getModelFromMouse() {
		return Transformation.multiply(this.getEyeFromModel.inv(), this.getEyeFromMouse());
	}

	pan(dx, dy) {
		var newTransT = Transformation.fromTranslation(vec3.fromValues(dx, dy, 0));
		var eyeFromModel = this.getEyeFromModel();
		newTransT.multiply(eyeFromModel);
		this.transT = newTransT.translation;
	}

	zoom(scale, x, y) {
		const [x, y, width, height] = this.viewport;
		const sx = width / 2 - x;
		const sy = height / 2 - y;
		var t = Transformation.fromTranslation(vec3.fromValues(sx, sy, 0));
		var s = Transformation.fromScaling(scale);
		var tInv = Transformation.fromTranslation(vec3.fromValues((-sx, -sy, 0)));
		var ret = Transformation.multiply(Transformation.multiply(Transformation.multiply(tInv, s), t), this.getEyeFromModel());
		this.transT = ret.translation;
		this.transS = ret.scale;
	}

	rotate(dx, dy, rotationCenter) {
		if (dy === 0 && dx === 0) return
		const height = this.viewport[3];
		const theta = np.hypot(dx, dy) * 4.0 / height;
		var t = Transformation.multiily(this.getModelFromMouse(), Transformation.fromTranslation(vec3.fromValues(-dy, dx, 0.0)));
		var r = Transformation.fromRotation(theta, t.translation, rotationCenter);
		var ret = Transformation.multiply(this.getEyeFromModel(), r);
		this.transR = ret.rotation;
		this.transT = ret.translation;
	}
}