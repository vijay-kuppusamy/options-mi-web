import React from "react";
import Chart from "react-apexcharts";

import { useSelector } from "react-redux";

const OpenInterestChart = () => {
  //
  const { strikePrices, callsOI, putsOI } = useSelector(
    (state) => state.openInterest
  );

  const series = [
    {
      name: "Calls Open Interest",
      type: "column",
      data: callsOI,
    },
    {
      name: "Puts Open Interest",
      type: "column",
      data: putsOI,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    colors: ["#009900", "#ff3333"],
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Open Interest",
      align: "left",
    },
    xaxis: {
      labels: {
        rotate: 0,
      },
      categories: strikePrices,
      title: {
        text: "Strike Prices",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      onDatasetHover: {
        highlightDataSeries: true,
      },
      x: {
        formatter: function (val) {
          return "Strike Price: " + val + " ";
        },
      },
      y: {
        formatter: function (value, series) {
          return value?.toLocaleString("en-IN");
        },
      },
    },
  };

  return (
    <>
      <Chart options={options} series={series} type="bar" height={350} />
    </>
  );
};

export default OpenInterestChart;
