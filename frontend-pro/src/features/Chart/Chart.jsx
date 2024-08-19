import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from '../../axios';
import "./Chart.css"



const ChartComponent = () => {

    const providerId = localStorage.getItem("providerId")

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/provider/provider-statistics-details/${providerId}`);
        const statisticsDetails = response.data.statisticsDetails;

        const data = statisticsDetails.map(statistic => ({
          label: `${statistic.headLine} (${new Date(statistic.createdAt).toLocaleDateString()})`,
          quantity: statistic.quantity
        }));

        setChartData(data);
      } catch(error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.map(dataPoint => dataPoint.label),
          datasets: [{
            label: 'Quantity',
            data: chartData.map(dataPoint => dataPoint.quantity),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
            responsive :true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="chart-container"> 
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
