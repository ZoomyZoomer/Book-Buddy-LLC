import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement);

const LineChart = ({ realData }) => {
  // Map realData to the labels and data for the 'Pages read' dataset
  const labels = realData.map(entry => entry.timeframe); // Extract day names (e.g., 'Sun', 'Mon')
  const pagesReadData = realData.map(entry => entry.pages); // Extract pages read for each day

  const data = {
    labels: realData.map(entry => entry.timeframe), // Dynamic labels
    datasets: [
      {
        label: 'Pages read',
        data: realData.map(entry => entry.pages), // Dynamic data
        borderColor: '#27AE85', // Line color
        backgroundColor: 'rgba(39, 174, 133, 0.2)', // Fill below the line
        pointBackgroundColor: '#27AE85', // Circle fill color matches border color
        borderWidth: 2,
        tension: 0.4, // Smooth the line
        fill: true, // Fill under the line
        pointRadius: 6, // Circle size
        pointHoverRadius: 6, // Keep hover size the same as default
        pointHoverBorderWidth: 2, // Maintain consistent border width on hover
      },
      {
        label: 'Expected',
        data: [50, 70, 60, 90, 100, 110, 120], // Static data
        borderColor: '#ADDFC9', // Line color
        backgroundColor: 'rgba(173, 223, 201, 0.2)', // Fill below the line
        pointBackgroundColor: '#ADDFC9', // Circle fill color matches border color
        borderWidth: 2,
        tension: 0.4, // Smooth the line
        fill: true, // Fill under the line
        pointRadius: 6, // Circle size
        pointHoverRadius: 6, // Keep hover size the same as default
        pointHoverBorderWidth: 2, // Maintain consistent border width on hover
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
      datalabels: {
        display: false, // Disable data labels explicitly
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide gridlines
        },
      },
      y: {
        beginAtZero: true, // Start Y-axis at zero
      },
    },
    hover: {
      mode: 'nearest', // Keep default hover mode
      intersect: true, // Ensure it triggers on points only
    },
    onHover: (event, chartElement) => {
      if (chartElement.length) {
        event.native.target.style.cursor = 'pointer'; // Set cursor to pointer on hover
      } else {
        event.native.target.style.cursor = 'default'; // Reset cursor when not hovering
      }
    },
  };
  

  return <Line data={data} options={options} />;
};

export default LineChart;
