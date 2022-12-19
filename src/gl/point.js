import assert from 'assert';

import {
	Vec3, Quat, Mat4
} from './glmatrix.js';
import { BoundingBox } from './boundingbox.js';

export class Point {
	constructor(ps) {
		if (ps === undefined) ps = [0.0, 0.0, 0.0];
		this.ps = new Vec3(ps);
	}

	scale(s) {
		let ret = this.ps.scale(s);
		return new Point([...ret.vec]);
	}

	midPoint(other) {
		return new Point([...this.ps.add(other.ps).scale(0.5).vec]);
	}
}

export class Direction {
	constructor(dir) {
		if (dir === undefined) dir = [1.0, 0.0, 0.0];
		this.dir = new Vec3(dir).normalize();
	}

	negate() {
		return new Vec3(...this.dir.negate());
	}
}

export class Vector extends Vec3 {

}

export class Quaternion {
	constructor(q) {
		if (q === undefined) q = [0.0, 0.0, 0.0, 1.0];
		assert(q.length === 4, 'Invalid input params for Quaternion constructor');
		let tempQuat = new Quat(q);
		this.quat = tempQuat.normalize();
		if (q[3] < 0) {
			this.quat = this.quat.negate();
		}
	}

	static dirToDir(dir1, dir2) {
		let dir1p = new Vec3(dir1).normalize();
		let dir2p = new Vec3(dir2).normalize();
		let cosTheta = dir1p.dot(dir2p);
		let theta = Math.acos(cosTheta);
		let cs = Math.cos(theta / 2);
		let sn = Math.sin(theta / 2);
		let x = dir1p.cross(dir2p).normalize().scale(sn);
		return new Quaternion([cs, ...x.vec]);
	}

	multiply(other) {
		let [ x1, y1, z1, w1 ] = this.quat.qvec;
        let [ x2, y2, z2, w2 ] = other.quat.qvec;
        let tup = [w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
               w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2,
               w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2,
			   w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2];
		let ret = new Quaternion();
		ret.quat = new Quat(tup);
		return ret;
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
		let ret = new Quaternion();
		ret.quat = new Quat(q);
		return ret;
	}

	matrix() {
		let [qx, qy, qz, qw] = this.quat.values();
        let m = [
            [1 - 2 * Math.pow(qy, 2) - 2 * Math.pow(qz, 2), 2 * qx * qy - 2 * qz * qw, 2 * qx * qz + 2 * qy * qw, 0.0],
            [2 * qx * qy + 2 * qz * qw, 1 - 2 * Math.pow(qx, 2) - 2 * Math.pow(qz, 2), 2 * qy * qz - 2 * qx * qw, 0.0],
            [2 * qx * qz - 2 * qy * qw, 2 * qy * qz + 2 * qx * qw, 1 - 2 * Math.pow(qx, 2) - 2 * Math.pow(qy, 2), 0.0],
            [0.0, 0.0, 0.0, 1.0]
		];
		return Mat4.create(m);
	}
}

export class Transformation {
	constructor(r, t, s) {
		if (r === undefined) r = new Quaternion();
		if (t === undefined) t = new Vec3();
		if (s === undefined) s = 1.0;
		this.r = r;
		this.t = t;
		this.s = s;
	}
	static fromTranslation(t) {
		return new Transformation(undefined, new Vec3(t));
	}

	static fromScaling (s) {
		return new Transformation(undefined, undefined, s);
	}

	static fromRotation (r) {
		return new Transformation(new Quaternion(r));
	}

	static fromDirAlignment (dir1, dir2, origin) {
		if (origin === undefined) origin = [0.0, 0.0, 0.0];
		let rotation = Quaternion.dirToDir(dir1, dir2);
		let to_origin = Transformation.fromTranslation(origin).inv();
		let final = to_origin.inv().multiply(new Transformation(rotation)).multiply(to_origin);
		return final;
	}

	multiply(other) {
		if (other instanceof Point) {
			return this.r.rotate(other.ps).add(this.t).scale(this.s);
		}
		if (other instanceof Vector) {
			return this.r.rotate(other.vec).scale(this.s);
		}
		if (other instanceof Direction) {
			return this.r.rotate(other.dir);
		}
		if (other instanceof Transformation) {
			let qp = this.r.multiply(other.r);
			let vp = this.r.rotate(other.t).add(this.t.scale(1.0 / other.s));
			return new Transformation(qp, vp, this.s * other.s);
		}
		if (other instanceof BoundingBox) {
			let ret = [];
			other.corners().forEach(p => {
				ret.push([...this.multiply(p).vec])
			})
			return new BoundingBox.create(ret);
		}
		if (other instanceof Number) {
			return this.s * other;
		}
	}

	inv() {
		let qp = this.r.inv();
		let vp = qp.rotate(this.t).scale(-this.s);
		let sp = 1.0 / this.s;
		return new Transformation(qp, vp, sp);
	}

	matrix() {
		let m = this.r.matrix();
		m.set(0, 3, this.t.vec[0]);
		m.set(1, 3, this.t.vec[1]);
		m.set(2, 3, this.t.vec[2]);
		m.set(3, 3, 1.0 / this.s);
		return m;
	}
}