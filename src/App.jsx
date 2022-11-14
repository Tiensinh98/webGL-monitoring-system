import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';


import Chart from './components/charts/Chart';
import Canvas from './components/canvas/Canvas';
import { defaultOptions, defaultData } from './utils/chart_properties';

function App() {
    const [data, setData] = useState(defaultData);
    useEffect(() => {
        setInterval(() => {
            setData((prevData) => {
                var newData = { ...prevData };
                var newLabels = [...newData.labels];
                newLabels.push(new Date().toLocaleTimeString());
                var newDatasets = [...newData.datasets]
                newDatasets.forEach((dataset) => {
                    dataset.data.push(Math.random() * 11);
                });
                return { labels: newLabels, datasets: newDatasets };
            });
        }, 1000);
    }, []);

    return (
        <div className="root-container">
            <Grid container spacing={3}>
                <Grid xs>
                    <Chart options={defaultOptions} data={data} />
                </Grid>
                <Grid xs>
                    <Canvas />
                </Grid>
            </Grid>
        </div>
    );
}

export default App;