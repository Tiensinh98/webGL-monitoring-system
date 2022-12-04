import vec3 from 'gl-matrix';

const primitiveModeMap = {1: gl.POINTS, 2: gl.LINES, 3: gl.TRIANGLES}
const colorRange = new Float32Array(
    [(0.0, 0.0, 0.7),
     (0.0, 0.0, 0.9),
     (0.0, 0.25, 1.0),
     (0.0, 0.5, 1.0),
     (0.0, 0.75, 1.0),
     (0.0, 1.0, 1.0),
     (0.25, 1.0, 0.5),
     (0.75, 1.0, 0.25),
     (1.0, 1.0, 0.0),
     (1.0, 0.75, 0.0),
     (1.0, 0.5, 0.0),
     (1.0, 0.25, 0.0),
     (0.75, 0.0, 0.0),
     (0.5, 0.0, 0.0)]);
const shininess = 100;
const numberOfBins = colorRange.length / 3;
const lowColor = vec3.fromValues(0.0, 0.0, 0.7);
const highColor = vec3.fromValues(0.5, 0.0, 0.0);

export const graphicsOptions = {
	color: vec3.fromValues(0.0, 0.0, 0.0),
	primitiveSize: 1,
	pick: null
}

export default GraphicsBody {
	constructor(vertices, scalarValues) {
		this.vertices = vertices;
		this.scalarValues = scalarValues;
		this.render = this.render.bind(this);
	}
	
	create() {
		return new GraphicsBody();
	}
	
	render() {
	
	}
}

export var createGenericGraphicsItem = (mesh, fieldName, options) => {
	const vertices = mesh.getVertices();
	const scalarValues = mesh.getScalarValuesFromFieldName(fieldName);
	const indices = mesh.getIndices();
	return GraphicsBody.create(vertices, indices, "scalarField", "scalarValues, {
	...graphicsOptions,
	...options
})
}