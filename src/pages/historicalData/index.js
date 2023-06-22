import React from "react";

import SearchForm from "./searchForm";

const HistoricalData = () => {
  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Historical Data</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <SearchForm />
        </div>
      </div>
    </>
  );
};

export default HistoricalData;
