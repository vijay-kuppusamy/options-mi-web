import React from "react";

import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  annotationPlugin
);

const PayoffChart = (props) => {
  //
  const spotPrice = parseInt(props.values.spotPrice);
  //
  let listLength = props.values.priceList.length;
  let startPrice = props.values.priceList[0];
  let endPrice = props.values.priceList[listLength - 1];

  const sd = props.values.standardDeviation;
  const firstSDP = spotPrice + sd;
  const firstSDN = spotPrice - sd;
  const secondSDP = spotPrice + sd * 2;
  const secondSDN = spotPrice - sd * 2;

  const options = {
    backgroundColor: "#66666680",
    borderWidth: 0.5,
    pointStyle: "circle",
    radius: 0,
    responsive: true,
    interaction: {
      intersect: true,
      mode: "index",
    },
    layout: {
      padding: {
        top: 40,
      },
    },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Underlying Price",
        },
        min: startPrice,
        max: endPrice,
        ticks: {
          maxRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: "Profit / Loss",
        },
      },
    },
    plugins: {
      autocolors: false,
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      annotation: {
        clip: false,
        common: {
          drawTime: "afterDraw",
        },
        annotations: {
          sd1box: {
            type: "box",
            xMin: firstSDN,
            xMax: firstSDP,
            borderWidth: 0,
            backgroundColor: "rgba(217, 217, 217, 0.20)",
          },
          sd2box: {
            type: "box",
            xMin: secondSDN,
            xMax: secondSDP,
            borderWidth: 0,
            backgroundColor: "rgba(217, 217, 217, 0.15)",
          },
          spotPrice: {
            type: "line",
            mode: "vertical",
            xMin: spotPrice,
            xMax: spotPrice,
            borderColor: "#666666",
            borderWidth: 1,
            borderDash: [3, 3],
            label: {
              display: true,
              content: Number(spotPrice)
                ? new Intl.NumberFormat("en-IN").format(spotPrice)
                : spotPrice,
              position: "end",
              yAdjust: -33,
              padding: 5,
              backgroundColor: "rgba(0, 0, 0, 0)",
              color: "rgba(0, 0, 0)",
              font: {
                size: 11,
              },
            },
          },
          sdP1: {
            type: "line",
            mode: "vertical",
            xMin: firstSDP,
            xMax: firstSDP,
            borderColor: "#bfbfbf",
            borderWidth: 1,
            borderDash: [3, 3],
            label: {
              display: true,
              content: "+1σ",
              position: "end",
              yAdjust: -33,
              padding: 5,
              backgroundColor: "rgba(0, 0, 0, 0)",
              color: "rgba(0, 0, 0)",
              font: {
                size: 10,
              },
            },
          },
          sdN1: {
            type: "line",
            mode: "vertical",
            xMin: firstSDN,
            xMax: firstSDN,
            borderColor: "#bfbfbf",
            borderWidth: 1,
            borderDash: [3, 3],
            label: {
              display: true,
              content: "-1σ",
              position: "end",
              yAdjust: -33,
              padding: 5,
              backgroundColor: "rgba(0, 0, 0, 0)",
              color: "rgba(0, 0, 0)",
              font: {
                size: 10,
              },
            },
          },
          sdN2: {
            type: "line",
            mode: "vertical",
            xMin: secondSDN,
            xMax: secondSDN,
            borderColor: "#bfbfbf",
            borderWidth: 1,
            borderDash: [3, 3],
            label: {
              display: true,
              content: "-2σ",
              position: "end",
              yAdjust: -33,
              padding: 5,
              backgroundColor: "rgba(0, 0, 0, 0)",
              color: "rgba(0, 0, 0)",
              font: {
                size: 10,
              },
            },
          },
          sdP2: {
            type: "line",
            mode: "vertical",
            xMin: secondSDP,
            xMax: secondSDP,
            borderColor: "#bfbfbf",
            borderWidth: 1,
            borderDash: [3, 3],
            label: {
              display: true,
              content: "+2σ",
              position: "end",
              yAdjust: -33,
              padding: 5,
              backgroundColor: "rgba(0, 0, 0, 0)",
              color: "rgba(0, 0, 0)",
              font: {
                size: 10,
              },
            },
          },
        },
      },
      tooltip: {
        enabled: true,
        intersect: false,
        boxPadding: 4,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        callbacks: {
          title: function (context) {
            let title = "";
            if (context[0].label) {
              title = "Spot price : " + context[0].label;
            }
            return title;
          },
          label: function (context) {
            let label = " P / L : ";
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  //const down = (ctx, upColor, downColor) => (ctx.p1.parsed.y > 0 ? upColor : downColor);

  const data = {
    labels: props.values.priceList,
    datasets: [
      {
        type: "line",
        data: props.values.theoriticalProfitLossList,
        borderColor: "#0000ff",
        backgroundColor: "#0000ff",
        borderWidth: 0.8,
        borderDash: [5, 5],
        fill: false,
      },
      {
        type: "line",
        data: props.values.profitLossList,
        borderColor: "#80ff80",
        backgroundColor: "#80ff80",
        borderWidth: 0,
        // segment: {
        //   borderColor: (ctx) => down(ctx, '#80ff80', '#ff8080')
        // },
        fill: {
          target: "origin",
          above: "rgb(204, 255, 204)",
          below: "rgb(255, 204, 204)",
          // above: "rgb(204, 255, 204, 0.75)",
          // below: "rgb(255, 204, 204, 0.75)",
        },
      },
    ],
  };
  //
  return (
    <>
      <Line options={options} data={data} />
    </>
  );
};

export default PayoffChart;
