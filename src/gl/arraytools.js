import {
	vec3
} from 'gl-matrix';

const min = (arr) {
	var minVec = vec3.create();
	arr.forEach(
		(v, i, subArr) => {
			if (i == 0) {
				minVec = vec3.fromValues(...subArr);
			}
			else {
				vec3.min(minVec, minVec, vec3.fromValues(...subArr));
			}
		}
	)
	return minVec;
}

export const max = (arr) {
	var maxVec = vec3.create();
	arr.forEach(
		(v, i, subArr) => {
			if (i == 0) {
				maxVec = vec3.fromValues(...subArr);
			}
			else {
				vec3.max(maxVec, minVec, vec3.fromValues(...subArr));
			}
		}
	)
	return maxVec;
}

export default min;

