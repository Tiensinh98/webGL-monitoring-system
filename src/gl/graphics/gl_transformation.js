import { 
	Transformation as T,
	Point
} from '../point.js';

import { Mat4 } from '../gl_matrix.js';

export class GLTransformation {
	constructor(ndcFromEye, ndcFromModel, eyeFromModel, eyeFromMouse, near, far, width, height) {
		this.ndcFromEye = ndcFromEye;
		this.ndcFromModel = ndcFromModel;
		this.eyeFromModel = eyeFromModel;
		this.eyeFromMouse = eyeFromMouse;
		this.width = width;
		this.height = height;
		this.near = near;
		this.far = far;
	}

	static create(width, height, eyeFromModel, boundingBox) {
		const eyeFromModelMat = eyeFromModel.matrix();
		const [left, right, bottom, top] = GLTransformation.getViewportEyeRect(width, height);
		const [near, far, ndcFromEye] = GLTransformation.getNdcFromEye(left, right, bottom, top, eyeFromModel, boundingBox);
		const eyeFromMouse = GLTransformation.getEyeFromMouse(width, height);
		var ndcFromModel = ndcFromEye.multiply(eyeFromModelMat);
		return new GLTransformation(ndcFromEye, ndcFromModel, eyeFromModelMat, eyeFromMouse, near, far, width, height);
	}

	static getViewportEyeRect(width, height) {
		const eyeFromMouse = GLTransformation.getEyeFromMouse(width, height);
		const tl = eyeFromMouse.multiply(new Point([0.0, 0.0, 0.0]));
		const br = eyeFromMouse.multiply(new Point([width, height, 0.0]));
		return [tl.get(0), br.get(0), tl.get(1), br.get(1)];
	}

	static getNdcFromEye(left, right, bottom, top, eyeFromModel, boundingBox) {
		let [near, far] = GLTransformation.getNearFar(eyeFromModel, boundingBox);
		if (Math.abs(near - far) < 1e-9) {
			near = -1e-4;
			far = 1e4;
		}
		return [near, far, Mat4.ortho(left, right, bottom, top, near, far)];
	}

	static getEyeFromMouse(width, height) {
		return T.fromTranslation( [- width / 2, - height / 2, 0.0]);
	}

	static getNearFar(eyeFromModel, boundingBox) {
		let eyeBox = boundingBox.rightMultiply(eyeFromModel);
		return [eyeBox.mn[2], eyeBox.mx[2]];
	}

	getNdcFromEyeForTriad(near, far) {
		return Mat4.ortho(- this.width / 2, this.width / 2, - this.height / 2, this.height / 2, near, far);
	}
}