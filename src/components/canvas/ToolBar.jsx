import React from 'react';

export default function ToolBar(props) {
    return (
    <div>
        <form>
            <label>Vertices</label>
            <input type="file" name='vertices' onChange={
                (_this) => {
                    props.readMeshFile(_this, parseFloat, 3);
                }
            }>
            </input>
            <label>Scalar values</label>
            <input type="file" name='scalarValues' onChange={
                (_this) => {
                    props.readMeshFile(_this, parseFloat, 1);
                }
            }>
            </input>
            <label>Indices</label>
            <input type="file" name='indices' onChange={
                (_this) => {
                    props.readMeshFile(_this, parseInt, 3);
                }
            }>
            </input>
            <label>Edege indices</label>
            <input type="file" name='edgeIndices' onChange={
                (_this) => {
                    props.readMeshFile(_this, parseInt, 2);
                }
            }>
            </input>
        </form>
    </div>);
}