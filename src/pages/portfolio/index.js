import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  getPortfolio,
  portfolioReset,
} from "../../features/portfolio/portfolioSlice";
import { setActiveMenu } from "../../features/settings/settingsSlice";
import PortfolioItems from "./portfolioItems";
import "./style.scss";

const Portfolio = () => {
  //
  const dispatch = useDispatch();
  //
  useEffect(() => {
    dispatch(setActiveMenu("portfolio"));
    dispatch(getPortfolio());
    const intervalCall = setInterval(() => {
      //console.log("Getting Portfolio");
      dispatch(getPortfolio());
    }, 60000);
    //
    return () => {
      dispatch(portfolioReset());
      clearInterval(intervalCall);
    };
  }, [dispatch]);

  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Portfolio</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <PortfolioItems />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
