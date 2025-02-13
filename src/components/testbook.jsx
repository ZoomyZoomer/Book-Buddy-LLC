import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const colors = {
  purple: {
    default: "rgba(149, 76, 233, 1)",
    half: "rgba(149, 76, 233, 0.5)",
    quarter: "rgba(149, 76, 233, 0.25)",
    zero: "rgba(149, 76, 233, 0)"
  },
  indigo: {
    default: "rgba(80, 102, 120, 1)",
    quarter: "rgba(80, 102, 120, 0.25)"
  },
  blue: {
    default: "rgba(52, 152, 219, 1)",
    half: "rgba(52, 152, 219, 0.5)",
    quarter: "rgba(52, 152, 219, 0.25)",
    zero: "rgba(52, 152, 219, 0)"
  }
};

const LineChart = ({ realData }) => {

  const chartRef = useRef(null);

  const labels = realData.map(entry => entry.timeframe); // Extract day names (e.g., 'Sun', 'Mon')
  const pagesReadData = realData.map(entry => entry.pages); // Extract pages read for each day

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
        let ctx = chart.ctx;
        
        let gradient1 = ctx.createLinearGradient(0, 25, 0, 300);
        gradient1.addColorStop(0, "rgba(39, 174, 133, 0.5)"); // Green half-opacity
        gradient1.addColorStop(0.35, "rgba(39, 174, 133, 0.25)"); // Green quarter-opacity
        gradient1.addColorStop(1, "rgba(39, 174, 133, 0)"); // Transparent
    
        chart.data.datasets[0].backgroundColor = gradient1;
        
        let gradient2 = ctx.createLinearGradient(0, 25, 0, 300);
        gradient2.addColorStop(0, "rgba(173, 223, 201, 0.8)"); // Increased opacity for stronger visibility
        gradient2.addColorStop(0.4, "rgba(173, 223, 201, 0.5)"); // More gradual transition
        gradient2.addColorStop(0.75, "rgba(173, 223, 201, 0.25)"); // Pushed back fading point
        gradient2.addColorStop(1, "rgba(173, 223, 201, 0.1)"); // Slight transparency instead of full disappearance

    
        chart.data.datasets[1].backgroundColor = gradient2;
        
        chart.update();
      }
  }, []);

  const data = {
    labels: realData.map(entry => entry.timeframe), // Dynamic labels
    datasets: [
      {
        label: 'Pages read',
        data: realData.map(entry => entry.pages),
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
      }
    ]
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

  return <Line ref={chartRef} data={data} options={options} />;
};

export default LineChart;
