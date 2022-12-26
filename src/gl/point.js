import assert from 'assert';

import {
	Vec3, Quat, Mat4
} from './gl_matrix.js';


export class Point {
	constructor(ps) {
		if (ps instanceof Point) {
			this.ps = new Vec3(...ps.ps);
			return;
		}
		if (ps === undefined) ps = new Vec3(0.0, 0.0, 0.0);
		assert(ps instanceof Vec3, 'ps must be a Vec3');
		this.ps = ps;
	}

	*[Symbol.iterator]() {
		let ps = [...this.ps];
        for (let i = 0; i < this.ps.v.length; i++) {
        	yield ps[i];
        }
    }

	scale(s) {
		return new Point(this.ps.scale(s));
	}

	midPoint(other) {
		return new Point(this.ps.add(other.ps).scale(0.5));
	}

	add(other) {
		if (other instanceof Vector) return new Point(this.ps.add(other.vs));
		return new Point(this.ps.add(other.ps));
	}

	subtract(other) {
		return new Point(this.ps.subtract(other.ps));
	}

	negate() {
		return new Point(this.ps.negate());
	}

	get(index) {
		return this.ps.get(index);
	}
}


export class Direction {
	constructor(dir) {
		if (dir instanceof Direction) {
			this.dir = new Vec3(...dir.dir);
			return;
		}
		if (dir === undefined) dir = new Vec3(1.0, 0.0, 0.0);
		assert(dir instanceof Vec3, 'dir must be a Vec3');
		this.dir = dir.normalize();
	}

	*[Symbol.iterator]() {
        for (let i = 0; i < this.dir.length; i++) {
        	yield this.dir.get(i);
        }
    }

	negate() {
		return new Direction(this.dir.negate());
	}

	get(index) {
		return this.dir.get(index);
	}
}

export class Vector {
	constructor(vs) {
		if (vs instanceof Vector) {
			this.vs = new Vec3(...vs.vs);
			return;
		}
		if (vs === undefined) vs = new Vec3(0.0, 0.0, 0.0);
		assert(vs instanceof Vec3, 'vs must be a Vec3');
		this.vs = vs;
	}

	scale(s) {
		return new Vector(this.vs.scale(s));
	}

	add(other) {
		if (other instanceof Point) return new Point(this.vs.add(other.ps));
		return new Vector(this.vs.add(other.vs));
	}

	negate() {
		return new Vector(this.vs.negate());
	}

	get(index) {
		return this.vs.get(index);
	}
}

export class Quaternion {
	constructor(q) {
		if (q === undefined) q = [0.0, 0.0, 0.0, 1.0];
		assert(q.length === 4, 'Invalid input params for Quaternion constructor');
		let tempQuat = new Quat(...q);
		this.quat = tempQuat.normalize();
		if (q[3] < 0) {
			this.quat = this.quat.negate();
		}
	}

	static dirToDir(dir1, dir2) {
		let dir1p = new Direction(dir1).normalize();
		let dir2p = new Direction(dir2).normalize();
		let cosTheta = dir1p.dot(dir2p);
		let theta = Math.acos(cosTheta);
		let cs = Math.cos(theta / 2);
		let sn = Math.sin(theta / 2);
		let x = dir1p.cross(dir2p).normalize().scale(sn);
		return new Quaternion([cs, ...x]);
	}

	multiply(other) {
		let [ x1, y1, z1, w1 ] = this.quat;
        let [ x2, y2, z2, w2 ] = other.quat;
        let tup = [
			w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
            w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2,
            w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2,
			w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
		];
		let ret = new Quaternion();
		ret.quat = new Quat(...tup);
		return ret;
	}

	rotate(t) {
		const v0 = t.get(0);
		const v1 = t.get(1);
		const v2 = t.get(2);
		let [qx, qy, qz, qw] = [...this.quat];
        let qw2 = qw * qw;
        let qx2 = qx * qx;
        let qy2 = qy * qy;
        let qz2 = qz * qz;
        let vp0 = (qw2 + qx2 - qy2 - qz2) * v0 + 2 * (qx * (qy * v1 + qz * v2) + qw * (qy * v2 - qz * v1));
        let vp1 = (qw2 - qx2 + qy2 - qz2) * v1 + 2 * (qy * (qz * v2 + qx * v0) + qw * (qz * v0 - qx * v2));
        let vp2 = (qw2 - qx2 - qy2 + qz2) * v2 + 2 * (qz * (qx * v0 + qy * v1) + qw * (qx * v1 - qy * v0));
		if (t instanceof Point) return new Point(new Vec3(vp0, vp1, vp2));
		else if (t instanceof Vector) return new Vector(new Vec3(vp0, vp1, vp2));
		else if (t instanceof Direction) return new Direction(new Vec3(vp0, vp1, vp2));
		return false;
	}

	inv() {
		let q = [...this.quat];
		q[3] *= -1;
		let ret = new Quaternion();
		ret.quat = new Quat(...q);
		return ret;
	}

	matrix() {
		let [qx, qy, qz, qw] = [...this.quat];
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
		if (t === undefined) t = new Vector();
		if (s === undefined) s = 1.0;
		this.r = r;
		this.t = t;
		this.s = s;
	}
	static fromTranslation(t) {
		return new Transformation(undefined, new Vector(new Vec3(...t)));
	}

	static fromScaling (s) {
		return new Transformation(undefined, undefined, s);
	}

	static fromRotation (angle, ax, cnt) {
		let axis = new Direction(ax);
        let center = new Point(new Vec3(...cnt));
        let c = Math.cos(angle / 2.0);
		let s = Math.sin(angle / 2.0);
        let t = Transformation.fromTranslation([...new Point().subtract(center)]);
        let q = new Transformation(new Quaternion([s * axis.get(0), s * axis.get(1), s * axis.get(2), c]));
        let tp = new Transformation(t.r, t.t.negate(), t.s);
        return tp.multiply(q).multiply(t);
	}

	static fromDirAlignment (dir1, dir2, origin) {
		if (origin === undefined) origin = [0.0, 0.0, 0.0];
		let rotation = Quaternion.dirToDir(dir1, dir2);
		let toOrigin = Transformation.fromTranslation(origin).inv();
		let final = toOrigin.inv().multiply(new Transformation(rotation)).multiply(toOrigin);
		return final;
	}

	multiply(other) {
		if (other instanceof Point) {
			return this.r.rotate(other).add(this.t).scale(this.s);
		}
		if (other instanceof Vector) {
			return this.r.rotate(other).scale(this.s);
		}
		if (other instanceof Direction) {
			return this.r.rotate(other);
		}
		if (other instanceof Transformation) {
			let qp = other.r.multiply(this.r);
			let vp = other.r.rotate(this.t).add(this.t.scale(1.0 / other.s));
			return new Transformation(qp, vp, this.s * other.s);
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
		m.set(0, 3, this.t.get(0));
		m.set(1, 3, this.t.get(1));
		m.set(2, 3, this.t.get(2));
		m.set(3, 3, 1.0 / this.s);
		return m;
	}
}