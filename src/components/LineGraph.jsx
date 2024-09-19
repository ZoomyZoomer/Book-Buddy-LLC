import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineGraph = ({reading_data, time}) => {
    const data = {
        labels: time,
        datasets: [
            {
                label: 'Sample Data',
                data: reading_data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'category',
            },
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                enabled: true, // Enable tooltips
                mode: 'nearest', // Show tooltip on nearest point
                intersect: true, // Only show tooltip when hovering directly over a point
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y} pages`;
                    }
                }
            },
            legend: {
                display: false, // Disable legend
            },
            datalabels: {
                display: false
            }
        },
        elements: {
            point: {
                radius: 5, // Default point radius
                hoverRadius: 7, // Point radius on hover
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default LineGraph;
