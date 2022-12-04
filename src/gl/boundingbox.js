import vec3 from 'gl-matrix';
import {
	min, max
} as art from './arraytools.js';

class BoundingBox {
	constructor(mn, mx) {
		this.mn = mn;
		this.mx = mx;
		this.getDiag = this.getDiag.bind(this);
		this.getCenter = this.getCenter.bind(this);
	}
	
	create() {
		return new BoundingBox(vec3.create(), vec3.create());
	}
	
	fromArray(arr) {
		return new BoundingBox(art.min(arr), art.max(arr)); 
	}
	
	add(other) {
	
	}
	
	subtract() {
	
	}
	
	getDiag() {
		return vec3.distance(mx, mn);
	}
	
	getCenter() {
		var ret = vec3.create();
		vec3.add(ret, this.mx, this.mn);
		vec3.scale(ret, ret, 0.5);
		return ret;
	}
	
}