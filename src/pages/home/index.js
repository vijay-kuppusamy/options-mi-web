import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import PriceCard from "./priceCard";
import optionChainImg from "../../assets/images/option-chain.png";
import openInterestImg from "../../assets/images/open-interest.png";
import strategyBuilderImg from "../../assets/images/strategy-builder.png";
import builtinStrategiesImg from "../../assets/images/built-in-strategies.png";

import { setActiveMenu } from "../../features/settings/settingsSlice";

import "./style.scss";

const Home = () => {
  //
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  const goToFeature = (page) => {
    navigate(page);
  };

  useEffect(() => {
    dispatch(setActiveMenu("home"));
    return () => {};
  }, [dispatch]);

  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Home</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="row row-deck row-cards">
              <div className="col-sm-6 col-lg-3">
                <PriceCard symbol="NIFTY 50" />
              </div>
              <div className="col-sm-6 col-lg-3">
                <PriceCard symbol="NIFTY BANK" />
              </div>
              <div className="col-sm-6 col-lg-3">
                <PriceCard symbol="NIFTY MIDCAP 50" />
              </div>
              <div className="col-sm-6 col-lg-3">
                <PriceCard symbol="NIFTY SMLCAP 50" />
              </div>
              <div className="col-md-6 col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Option Chain & Option Greeks</h3>
                    <p className="text-muted">
                      Our Option Chain & Option Greeks screen offers detailed
                      data on the index and stocks option contracts that are
                      trading in the NSE.
                    </p>
                  </div>
                  <div
                    className="card-img-bottom img-responsive img-responsive-21x9"
                    onClick={() => goToFeature("/option-chain")}
                    style={{
                      objectFit: "cover",
                      cursor: "pointer",
                      backgroundImage: `url(${optionChainImg})`,
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Open Interest</h3>
                    <p className="text-muted">
                      Charts of open interest offer precise information on the
                      options that are held in active positions by traders and
                      investors.
                    </p>
                  </div>
                  <div
                    className="card-img-bottom img-responsive img-responsive-21x9"
                    onClick={() => goToFeature("/open-interest")}
                    style={{
                      objectFit: "cover",
                      cursor: "pointer",
                      backgroundImage: `url(${openInterestImg})`,
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Built-in Strategies</h3>
                    <p className="text-muted">
                      Utilize our built-in strategies to learn and comprehend
                      the finest option trading strategies in order to lower
                      risk and enhance profit.
                    </p>
                  </div>
                  <div
                    className="card-img-bottom img-responsive img-responsive-21x9"
                    onClick={() => goToFeature("/builtin-strategies")}
                    style={{
                      objectFit: "cover",
                      cursor: "pointer",
                      backgroundImage: `url(${builtinStrategiesImg})`,
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Strategy Builder</h3>
                    <p className="text-muted">
                      To reduce risk and increase profit, test your option
                      trading ideas with our Strategy Builder tool.
                    </p>
                  </div>
                  <div
                    className="card-img-bottom img-responsive img-responsive-21x9"
                    onClick={() => goToFeature("/strategy-builder")}
                    style={{
                      objectFit: "cover",
                      cursor: "pointer",
                      backgroundImage: `url(${strategyBuilderImg})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
