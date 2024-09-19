import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ArcElement } from 'chart.js';
import { useEffect } from 'react';
Chart.register(ArcElement);

ChartJS.register(ChartDataLabels);

const DonutChart = ({value}) => {
 
    const data = {
        datasets: [
            {
                data: [value, 100 - value],
                backgroundColor: ['#06AB78', '#EFEFEF'],
                borderColor: ['#4CAF50', '#d3d3d3'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
      cutout: '80%',
      plugins: {
          tooltip: {
              enabled: false, // Disable tooltips
          },
          legend: {
              display: false, // Disable the legend
          },
          datalabels: {
              display: false, // Ensure no data labels are displayed
          },
      },
      elements: {
          center: {
              text: '',
          },
      },
  };

  return (
    <div className='donut-chart-styles'>
        <Doughnut data={data} options={options} />
    </div>
);
};

export default DonutChart;
