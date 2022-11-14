const defaultOptions = {
    responsive: true,
    animation: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'DHI Monitoring System',
        },
    },
    elements: {
      point: {
        radius: 5,
        pointStyle: 'circle',
        hoverRadius: 2,
        hoverBorderWidth: 3,
      },
      line: {
        fill: true,
      },
    },
    scales: {
      x: {
        ticks: {
          count: 5,
          maxRotation: 0,
          major: {
            enabled: true
          },
          callback: function(val, index) {
            // Hide every 2nd tick label
            return index % 5 === 0 ? this.getLabelForValue(val) : '';
          },
          font: function(context) {
            if (context.tick && context.tick.major) {
              return {
                weight: 'bold',
              };
            }
          },
          color: 'red',
        }
      },
      // y: {
      //   min: 0,
      //   max: 10,
      // }
    }
};

const labels = [];

const defaultData = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export {defaultOptions, defaultData};