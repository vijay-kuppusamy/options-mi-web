import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setActiveMenu } from "../../features/settings/settingsSlice";
import { authenticate } from "../../features/auth/authSlice";

import Strategy from "./strategy";
import Payoff from "./payoff";

import "./style.scss";

const StrategyBuilder = () => {
  //
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveMenu("trade"));
    dispatch(authenticate());
  }, [dispatch]);

  return (
    <>
      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-xl">
            <div className="row row-deck row-cards">
              <div className="col-sm-12 col-md-12 col-lg-5">
                <Strategy />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-7">
                <Payoff />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StrategyBuilder;
