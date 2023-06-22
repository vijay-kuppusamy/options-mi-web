import React from "react";
import Chart from "react-apexcharts";

const HistoricalChart = (props) => {
  let time = props?.values?.time;
  let indicsOpen = props?.values?.indicsOpen;
  let peOpen = props?.values?.peOpen;
  let ceOpen = props?.values?.ceOpen;

  let minimum = Math.min(...indicsOpen);
  let start = Math.round(minimum / 50) * 50;

  const series = [
    {
      name: "Index",
      type: "line",
      data: indicsOpen,
    },
    {
      name: "Call",
      type: "line",
      data: ceOpen,
    },
    {
      name: "Put",
      type: "line",
      data: peOpen,
    },
  ];

  const options = {
    chart: {
      type: "line",
      height: 500,
    },

    xaxis: {
      labels: {
        rotate: 0,
      },
      categories: time,
      title: {
        text: "Time",
      },
    },
    yaxis: [
      {
        seriesName: "Index",
        min: start - 50,
        tickAmount: 10,
        title: {
          text: "Index",
        },
      },
      {
        seriesName: "Call",
        opposite: true,
        title: {
          text: "Call",
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0);
          }
          return y;
        },
      },
    },
  };

  return (
    <>
      <Chart options={options} series={series} type="line" height={500} />
    </>
  );
};

export default HistoricalChart;
