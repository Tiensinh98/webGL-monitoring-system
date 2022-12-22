import { Point, Transformation as T } from './point.js';
import { Numpy as np } from './numpy.js';

export class BoundingBox {
	constructor(mn, mx) {
		if (mn === undefined) mn = [0.0, 0.0, 0.0];
		if (mx === undefined) mx = [0.0, 0.0, 0.0];
		this.mn = mn;
		this.mx = mx;
	}

	static create(arr) {
		return new BoundingBox(np.min(arr, 0), np.max(arr, 0));
	}

	rightMultiply(transformation) {
		let ret = [];
		this.corners().forEach(p => {
			ret.push([...transformation.multiply(p).ps.vec])
		})
		return new BoundingBox.create(ret);
	}

	add(other) {
		return new BoundingBox(
			np.min([this.mn, other.mn], 0), 
			np.max([this.mx, other.mx], 0)
		);
	}

	diag() {
		return np.distance(this.mx, this.mn);
	}

	center() {
		return np.scale(np.sum([this.mx, this.mn], 0), 0.5);
	}

	radius() {
		let dm = np.scale(np.subtract(this.mx, this.mn), 0.5);
        return np.sqrt(np.square(dm));
	}

	corners() {
		let a = this.mn;
		let b = this.mx;
		let points = [
			[a[0], a[1], a[2]],
			[a[0], a[1], b[2]], 
			[a[0], b[1], a[2]],
            [a[0], b[1], b[2]], 
			[b[0], a[1], a[2]], 
			[b[0], a[1], b[2]],
            [b[0], b[1], a[2]], 
			[b[0], b[1], b[2]]
		];
		let ret = [];
		points.forEach(p => {
			ret.push(new Point(p));
		})
		return ret;
	}

	getScaled(factor) {
		let center = this.center();
        let v = np.scale(np.subtract(this.mx, this.mn), (factor / 2.0))
        return new BoundingBox(np.subtract(center, v), np.sum([center, v], 0));
	}
}