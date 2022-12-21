import matrix from 'matrix-js';
import assert from 'assert';

var fromMat = (mat) => {
	let ret = [];
	let temp = [];
	mat.forEach((element, idx) => {
		if (idx + 1 % mat.length !== 0) {
			temp.push(element);
		}
		if (idx + 1 % mat.length === mat.length - 1) {
			temp.push(element);
			ret.push(temp);
			temp = [];
		}
	})
	return ret;
}

var min = (arr, axis) => {
	const m = matrix(arr);
	const size = m.size();
	let ret = [];
	if (axis === undefined) {
		return Math.min(...flatten(arr));
	}
	else if (axis === 0) {
		for (let i = 0; i < size[1]; i ++) {
			let column = m([], i);
			ret.push(Math.min(...column));
		}
		return ret;
	}
	else if (axis === 1) {
		for (let i = 0; i < size[0]; i ++) {
			ret.push(Math.min(...m(i)));
		}
		return ret;
	}
	console.log(`Invalid axis ${axis}`);
	return ret;
}

var max = (arr, axis) => {
	const m = matrix(arr);
	const size = m.size();
	let ret = [];
	if (axis === undefined) {
		return Math.max(...flatten(arr));
	}
	else if (axis === 0) {
		for (let i = 0; i < size[1]; i ++) {
			let column = m([], i);
			ret.push(Math.max(...column));
		}
		return ret;
	}
	else if (axis === 1) {
		for (let i = 0; i < size[0]; i ++) {
			ret.push(Math.max(...m(i)));
		}
		return ret;
	}
	console.log(`Invalid axis ${axis}`);
	return ret;
}

var scale = (arr, s) => {
	const m = matrix(arr);
	return m.map(e => e * s);
}

var sum = (arr, axis) => {
	const m = matrix(arr);
	const size = m.size();
	let ret = [];
	if (axis === undefined) {
		return arr.reduce(
			(a, b) => {
				if (size.length === 1) return a + b;
				let ta = a.reduce((a1, a2) => a1 + a2, 0);
				let tb = b.reduce((b1, b2) => b1 + b2, 0);
				return ta + tb;
			}
		);
	}
	else if (axis === 0) {
		for (let i = 0; i < size[1]; i ++) {
			let column = m([], i);
			ret.push(column.reduce(
				(a, b) => {
					let ta = a.reduce((a1, a2) => a1 + a2, 0);
					let tb = b.reduce((b1, b2) => b1 + b2, 0);
					return ta + tb;
				}
			));
		}
		return ret;
	}
	else if (axis === 1) {
		for (let i = 0; i < size[0]; i ++) {
			ret.push(m(i).reduce((a, b) => a + b, 0));
		}
		return ret;
	}
	console.log(`Invalid axis ${axis}`);
	return ret;
}

var subtract = (arr1, arr2) => {
	let m = matrix(arr1);
	let n = matrix(arr2);
	if (m.size().length === 1 && n.size().length === 1) {
		m = matrix([m([], 0)]);
		n = matrix([n([], 0)]);
		return m.sub(n)[0];
	}
	return m.sub(n);
}

var square = (arr) => {
	let m = matrix(arr);
	return m.map(e => e * e);
}

var sqrt = (arr) => {
	let m = matrix(arr);
	return m.map(e => Math.sqrt(e));
}

var norm = (arr) => {
	return Math.sqrt(sum(square(arr)));
}

var flatten = (arr) => {
	if (matrix(arr).size().length === 1) return arr;
	let m = [];
	arr.forEach((element) => {
		m = [...m, ...element];
	});
	return m;
}

var hypot = (dx, dy) => {
	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

var distance = (arr1, arr2) => {
	return norm(subtract(arr1, arr2));
}

var getShape = (arr) => {
	return matrix(arr).size();
}

var linspace = (mn, mx, interval) => {
	assert(mn < mx, 'Min must be smaller than max');
	let delta = (mx - mn) / (interval - 1);
	let ret = [];
	for (let i = 0; i <= interval - 1; i++) {
		ret.push(mn + delta * i);
	}
	return ret;
}

export var Numpy = {
	fromMat: fromMat,
	min: min,
	max: max,
	scale: scale,
	sum: sum,
	subtract: subtract,
	square: square,
	sqrt: sqrt,
	norm: norm,
	flatten: flatten,
	hypot: hypot,
	distance: distance,
	getShape: getShape,
	linspace: linspace
}

