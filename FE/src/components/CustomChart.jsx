import React, { useEffect, useRef } from "react";
import styles from "../assets/styles/Chart.module.css";
import Chart, { Interaction, Tooltip } from "chart.js/auto";

function CustomChart({
  title,
  xAxis,
  datasets,
  grid = false,
  type,
  label,
  icon,
  valueFormatter,
}) {
  const canvasRef = useRef();

  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type: type,
      data: {
        labels: xAxis,
        datasets: datasets.map((ds) => ({
          label: ds.label,
          data: ds.data,
          borderWidth: 1,
          tension: 0.1,
          fill: true,

          ...ds, // cho phép override thêm (color, background,...)
        })),
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            grid: {
              display: grid,
            },
          },
        },

        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: label,
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                return valueFormatter
                  ? `${valueFormatter(context.raw)}`
                  : `${context.raw}`;
              },
              labelPointStyle: function (context) {
                return {
                  pointStyle: "rect",
                };
              },
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [xAxis, datasets, type, grid]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {icon}
        <p>{title}</p>
      </div>
      <div className={styles.cardBody}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default CustomChart;
