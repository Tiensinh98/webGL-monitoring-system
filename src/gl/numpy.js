import { matrix } from 'matrix-js';


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
		return Math.min(...array.flatten(arr));
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
		return Math.max(...array.flatten(arr));
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
			ret.push(m(i).reduce((a, b) => a +b, 0));
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

var flatten = (arr) => {
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
	return Math.sqrt(sum(square(subtract(arr1, arr2))));
}

export default numpy = {
	fromMat: fromMat,
	min: min,
	max: max,
	scale: scale,
	sum: sum,
	subtract: subtract,
	square: square,
	sqrt: sqrt,
	flatten: flatten,
	hypot: hypot,
	distance: distance
}

