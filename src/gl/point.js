import {
	Vec3, Vec4,
	Mat4, Quat
} from './glmatrix.js';

class Quaternion {
	constructor(q) {
		if (q === undefined) q = [0.0, 0.0, 0.0, 1.0];
		assert(q.length === 4, 'Invalid input params for Quaternion constructor');
		let tempQuat = new Quat(q);
		this.quat = tempQuat.normalize();
		if (q[3] < 0) {
			this.quat = this.quat.negate();
		}
	}

	multiply(other) {
		let [ x1, y1, z1, w1 ] = this.quat.qvec;
        let [ x2, y2, z2, w2 ] = other.quat.qvec;
        let tup = [w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
               w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2,
               w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2,
			   w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2];
		let q = new Quaternion(tup);
		return q;
	}

	rotate(t) {
		let v = t.vec;
		let [qx, qy, qz, qw] = this.quat.values();
        let qw2 = qw * qw;
        let qx2 = qx * qx;
        let qy2 = qy * qy;
        let qz2 = qz * qz;
        let vp0 = (qw2 + qx2 - qy2 - qz2) * v[0] + 2 * (qx * (qy * v[1] + qz * v[2]) + qw * (qy * v[2] - qz * v[1]));
        let vp1 = (qw2 - qx2 + qy2 - qz2) * v[1] + 2 * (qy * (qz * v[2] + qx * v[0]) + qw * (qz * v[0] - qx * v[2]));
        let vp2 = (qw2 - qx2 - qy2 + qz2) * v[2] + 2 * (qz * (qx * v[0] + qy * v[1]) + qw * (qx * v[1] - qy * v[0]));
		return new Vec3([vp0, vp1, vp2]);
	}

	inv() {
		let q = this.quat.values();
		q[3] *= -1;
		return new Quaternion(q);
	}
}

class Transformation {
	constructor(r, t, s) {
		if (r === undefined) r = new Quaternion();
		if (t === undefined) t = new Vec3();
		if (s === undefined) s = 1.0;
		this.r = r;
		this.t = t;
		this.s = s;
	}

	multiply(other) {
		let qp = this.r.multiply(other.r);
		let vp = this.r.rotate(other.t).add(this.t.scale(1.0 / other.s));
		return new Transformation(qp, vp, this.s * other.s);
	}

	inv() {
		let qp = this.r.inv();
		let vp = qp.rotate(this.t).scale(-this.s);
		let sp = 1.0 / this.s;
		return new Transformation(qp, vp, sp);
	}
}

export default transform = {
	create: (r, t, s) => new Transformation(r, t, s),
	fromTranslation: (t) => new Transformation(undefined, new Vec3(t)),
	fromScaling: (s) => new Transformation(undefined, undefined, s),
	fromRotation: (r) => new Transformation(new Quaternion(r)),
	fromDirAlignment: (dir1, dir2, origin) => {
		if (origin === undefined) origin = [0.0, 0.0, 0.0];
		let rotation = quaternion.dirToDir(dir1, dir2);
		let to_origin = transform.fromTranslation(origin).inv();
		let final = to_origin.inv().multiply(new Transformation(rotation)).multiply(to_origin);
		return final;
	}
}

export var quaternion = {
	create: () => new Quaternion(),
	dirToDir: (dir1, dir2) => {
		let dir1p = new Vec3(dir1).normalize();
		let dir2p = new Vec3(dir2).normalize();
		let cosTheta = dir1p.dot(dir2p);
		let theta = Math.acos(cosTheta);
		let cs = Math.cos(theta / 2);
		let sn = Math.sin(theta / 2);
		let x = dir1p.cross(dir2p).normalize().scale(sn);
		return new Quaternion([cs, ...x.vec]);
	}
}