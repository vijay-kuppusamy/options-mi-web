import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Oval } from "react-loader-spinner";

import homeService from "../../services/homeService";
import { formatValue } from "../../business/Utils";

function processResponse(response) {
  let closePrices = [];
  let dates = [];
  if (response && response.length > 0) {
    response.forEach((element) => {
      closePrices.push(element.close);
      dates.push(element.date);
    });
  }
  return { closePrices, dates };
}

function getStartPrice(closePrices) {
  if (closePrices && closePrices.length > 0) {
    return closePrices[0];
  } else {
    return 0;
  }
}

function getEndPrice(closePrices) {
  if (closePrices && closePrices.length > 0) {
    return closePrices[closePrices.length - 1];
  } else {
    return 0;
  }
}

function getPerChange(startPrice, priceChange) {
  let pChange = 0;
  try {
    pChange = (priceChange * 100) / startPrice;
  } catch (error) {
    console.log(error);
  }
  return pChange;
}

const PriceCard = (props) => {
  let symbol = props.symbol;

  const [priceDetail, setPriceDetail] = useState({});
  const [closePrices, setClosePrices] = useState([]);
  const [dates, setDates] = useState([]);

  let isLoading = false;

  //let green = "#00ff00";
  //let red = "#ff0000";
  let color = "";
  let startPrice = getStartPrice(closePrices);
  let endPrice = getEndPrice(closePrices);
  let priceChange = endPrice - startPrice;
  let pPriceChange = getPerChange(startPrice, priceChange);

  if (startPrice > endPrice) {
    color = "#ff0000";
  } else {
    color = "#00ff00";
  }
  const series = [
    {
      name: "Price",
      data: closePrices,
    },
  ];

  const options = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      height: 40.0,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 0.2,
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    grid: {
      strokeDashArray: 4,
    },
    tooltip: {
      followCursor: true,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      type: "datetime",
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    labels: dates,
    colors: [color],
    legend: {
      show: false,
    },
  };

  useEffect(() => {
    //
    const intervalCall = setInterval(() => {
      //console.log("Getting Price Detail");
      homeService
        .getPriceDetail({ symbol })
        .then((response) => {
          setPriceDetail(response.response);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 60000);

    if (symbol) {
      isLoading = true;

      homeService
        .getPriceDetail({ symbol })
        .then((response) => {
          setPriceDetail(response.response);
        })
        .catch((error) => {
          console.log(error);
        });

      homeService
        .getHistoricalData({ symbol })
        .then((response) => {
          let values = processResponse(response.response);
          setClosePrices(values.closePrices);
          setDates(values.dates);
        })
        .catch((error) => {
          console.log(error);
        });
      isLoading = false;
    }

    return () => {
      isLoading = false;
      clearInterval(intervalCall);
    };
  }, [symbol]);

  return (
    <>
      {isLoading && (
        <div className="overlay">
          <div className="center-screen">
            <Oval
              color="#206bc4"
              secondaryColor="#659fe6"
              visible={isLoading}
              strokeWidth={4}
              height={65}
              width={65}
            />
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="subheader">{symbol}</div>
          </div>
          <div className="d-flex align-items-baseline">
            <div className="h1 mb-0 me-2">
              {formatValue(priceDetail?.lastPrice, "numeric")}
            </div>
            <div className="me-auto">
              {priceDetail?.pChange > 0 ? (
                <span className="text-green d-inline-flex align-items-center lh-1">
                  {formatValue(priceDetail?.pChange, "percentage")}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon ms-1"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="3 17 9 11 13 15 21 7" />
                    <polyline points="14 7 21 7 21 14" />
                  </svg>
                </span>
              ) : (
                <span className="text-red d-inline-flex align-items-center lh-1">
                  {formatValue(priceDetail?.pChange, "percentage")}{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon ms-1"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="3 7 9 13 13 9 21 17" />
                    <polyline points="21 10 21 17 14 17" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="his-data">
          <div className="his-data-label">
            <span className="his-data-text">Last 30 days</span>
            {priceChange > 0 ? (
              <>
                <span className="text-green d-inline-flex align-items-center lh-1 his-data-text">
                  {formatValue(priceChange, "numeric")}{" "}
                </span>
                <span className="text-green d-inline-flex align-items-center lh-1 his-data-text">
                  {formatValue(pPriceChange, "percentage")}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon ms-1"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="3 17 9 11 13 15 21 7" />
                    <polyline points="14 7 21 7 21 14" />
                  </svg>
                </span>
              </>
            ) : (
              <>
                <span className="text-red d-inline-flex align-items-center lh-1 his-data-text">
                  {formatValue(priceChange, "numeric")}
                </span>
                <span className="text-red d-inline-flex align-items-center lh-1 his-data-text">
                  {formatValue(pPriceChange, "percentage")}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon ms-1"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="3 7 9 13 13 9 21 17" />
                    <polyline points="21 10 21 17 14 17" />
                  </svg>
                </span>
              </>
            )}
          </div>
          <div>
            <Chart options={options} series={series} type="area" height={50} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceCard;
