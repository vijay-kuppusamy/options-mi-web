import React, { useState } from "react";

import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import HistoricalChart from "./historicalChart";
import historicalDataService from "../../features/historicalData/historicalDataService";

const SearchForm = () => {
  //
  const [fieldSymbol, setFieldSymbol] = useState("NIFTY");
  const [searchDate, setSearchDate] = useState(new Date());
  const [chartData, setChartData] = useState(null);
  //
  const symbolOptions = [
    { value: "NIFTY", label: "NIFTY" },
    { value: "BANKNIFTY", label: "BANKNIFTY" },
  ];

  const onSymbolChange = (selected) => {
    setFieldSymbol(selected.value);
  };

  const optionSearch = (event) => {
    event.preventDefault();
    console.log(fieldSymbol, searchDate.toISOString().split("T")[0]);

    historicalDataService
      .getIndicesHistoricalIoedData({
        symbol: fieldSymbol,
        date: searchDate.toISOString().split("T")[0],
      })
      .then((response) => {
        setChartData(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="container-xl">
        <div className="card">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-auto">
                <label htmlFor="symbols" className="search-label">
                  Symbol
                </label>
              </div>
              <div className="col-md-2">
                <Select
                  name="fieldSymbol"
                  className="oc-search-select-symbol"
                  value={{ value: fieldSymbol, label: fieldSymbol }}
                  onChange={onSymbolChange}
                  options={symbolOptions}
                />
              </div>
              <div className="col-auto">
                <label htmlFor="fieldDate" className="search-label">
                  Date
                </label>
              </div>
              <div className="col-md-2">
                <DatePicker
                  className="form-control"
                  selected={searchDate}
                  onChange={(date) => setSearchDate(date)}
                />
              </div>
              <div className="col-md-2">
                <button
                  onClick={optionSearch}
                  className="btn btn-primary w-100"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            {chartData && <HistoricalChart values={chartData} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchForm;
