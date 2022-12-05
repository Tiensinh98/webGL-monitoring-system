

class GLTransformation {
	constructor(ndcFromEye, ndcFromModel, eyeFromModel, eyeFromMouse, near, far, width, height) {
		this.eyeFromModel = eyeFromModel;
		this.ndcFromEye = ndcFromEye;
		this.ndcFromModel = ndcFromModel;
		this.eyeFromMouse = eyeFromMouse;
		this.width = width;
		this.height = height;
		this.near = near;
		this.far = far;
	}

	create(width, height, eyeFromModel, boundingBox) {
		const [left, right, bottom, top] = GLTransformation.getViewportEyeRect(width, height);
		const eyeFromModelMat = eyeFromModel.toMatrix();
		const[near, far, ndcFromEye] = GLTransformation.getNdcFromEye(left, right, bottom, top, eyeFromModelMat, boundingBox);
		var ndcFromModelMat = mat4.create();
		mat4.multiply(ndcFromModelMat, ndcFromEye);
		mat4.multiply(ndcFromModelMat, eyeFromModelMat);
		var eyeFromMouse = GLTrasnformation.getEyeFromMouse(width, height);
		return GLTrasnformation(ndcFromEye, ndcFromModelMat, eyeFromModelMat, eye_from_mouse, near, far, width, height);
	}

	getViewportEyeRect(width, height) {
		const eyeFromMouse = GLTrasnformation.getEyeFromMouse(width, height);

		const tl = eye_from_mouse * pt.Point((0.0, 0.0, 0.0))
		br = eye_from_mouse * pt.Point((float(width), float(height), 0.0))
		return tl[0], br[0], tl[1], br[1]
	}

}