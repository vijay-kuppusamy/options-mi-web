import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Accordion from "react-bootstrap/Accordion";

import { FcBullish, FcBearish, FcNeutralTrading } from "react-icons/fc";
import buyCallImg from "../../assets/images/buy-call.png";
import sellPutImg from "../../assets/images/sell-put.png";
import bullCallSpreadImg from "../../assets/images/bull-call-spread.png";
import callRatioBackSpreadImg from "../../assets/images/call-ratio-back-spread.png";
import bearCallLadderImg from "../../assets/images/bear-call-ladder.png";
import sellCallImg from "../../assets/images/sell-call.png";
import buyPutImg from "../../assets/images/buy-put.png";
import bearPutSpreadImg from "../../assets/images/bear-put-spread.png";
import putRatioBackSpreadImg from "../../assets/images/put-ratio-back-spread.png";
import longStraddleImg from "../../assets/images/long-straddle.png";
import shortStraddleImg from "../../assets/images/short-straddle.png";
import longStrangleImg from "../../assets/images/long-strangle.png";
import shortStrangleImg from "../../assets/images/short-strangle.png";

import { setStrategy } from "../../features/builtinStrategies/builtinStrategySlice";
import { resetAuth, logout } from "../../features/auth/authSlice";
import InfoModal from "../../components/InfoModal";

const Strategies = () => {
  //
  const dispatch = useDispatch();

  const authStatus = useSelector((state) => state.auth.authStatus);
  const authMessage = useSelector((state) => state.auth.authMessage);

  const funSetStrategy = (strategy) => {
    dispatch(setStrategy(strategy));
  };

  //Modal start
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  //Modal End

  useEffect(() => {
    if (authStatus === "failed" && authMessage) {
      if (authMessage === "Unauthorized") {
        dispatch(logout());
        handleShow();
      }
    }
    return () => {
      if (authMessage) dispatch(resetAuth());
    };
  }, [dispatch, authStatus, authMessage]);

  return (
    <>
      <div className="strategy">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Built-in Strategies</h3>
          </div>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <FcBullish className="strategy-icon" />
                Bullish
              </Accordion.Header>
              <Accordion.Body>
                <div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Buy Call")}
                  >
                    <div>
                      <img
                        src={buyCallImg}
                        className="strategy-card-img"
                        alt="Buy Call"
                      />
                    </div>
                    <div className="strategy-card-title">Buy Call</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Sell Put")}
                  >
                    <img
                      src={sellPutImg}
                      className="strategy-card-img"
                      alt="Sell Put"
                    />
                    <div className="strategy-card-title">Sell Put</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Bull Call Spread")}
                  >
                    <img
                      src={bullCallSpreadImg}
                      className="strategy-card-img"
                      alt="Bull Call Spread"
                    />
                    <div className="strategy-card-title">Bull Call Spread</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Bull Put Spread")}
                  >
                    <img
                      src={bullCallSpreadImg}
                      className="strategy-card-img"
                      alt="Bull Put Spread"
                    />
                    <div className="strategy-card-title">Bull Put Spread</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Call Ratio Back Spread")}
                  >
                    <img
                      src={callRatioBackSpreadImg}
                      className="strategy-card-img"
                      alt="Bull Call Spread"
                    />
                    <div className="strategy-card-title">
                      Call Ratio Back Spread
                    </div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Bear Call Ladder")}
                  >
                    <img
                      src={bearCallLadderImg}
                      className="strategy-card-img"
                      alt="Bear Call Ladder"
                    />
                    <div className="strategy-card-title">Bear Call Ladder</div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <FcBearish className="strategy-icon" />
                Bearish
              </Accordion.Header>
              <Accordion.Body>
                <div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Sell Call")}
                  >
                    <img
                      src={sellCallImg}
                      className="strategy-card-img"
                      alt="Sell Call"
                    />
                    <div className="strategy-card-title">Sell Call</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Buy Put")}
                  >
                    <img
                      src={buyPutImg}
                      className="strategy-card-img"
                      alt="Buy Put"
                    />
                    <div className="strategy-card-title">Buy Put</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Bear Put Spread")}
                  >
                    <img
                      src={bearPutSpreadImg}
                      className="strategy-card-img"
                      alt="Bear Put Spread"
                    />
                    <div className="strategy-card-title">Bear Put Spread</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Bear Call Spread")}
                  >
                    <img
                      src={bearPutSpreadImg}
                      className="strategy-card-img"
                      alt="Bear Call Spread"
                    />
                    <div className="strategy-card-title">Bear Call Spread</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Put Ratio Back Spread")}
                  >
                    <img
                      src={putRatioBackSpreadImg}
                      className="strategy-card-img"
                      alt="Put Ratio Back Spread"
                    />
                    <div className="strategy-card-title">
                      Put Ratio Back Spread
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <FcNeutralTrading className="strategy-icon" />
                Neutral
              </Accordion.Header>
              <Accordion.Body>
                <div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Long Straddle")}
                  >
                    <img
                      src={longStraddleImg}
                      className="strategy-card-img"
                      alt="Long Straddle"
                    />
                    <div className="strategy-card-title">Long Straddle</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Short Straddle")}
                  >
                    <img
                      src={shortStraddleImg}
                      className="strategy-card-img"
                      alt="Short Straddle"
                    />
                    <div className="strategy-card-title">Short Straddle</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Long Strangle")}
                  >
                    <img
                      src={longStrangleImg}
                      className="strategy-card-img"
                      alt="Long Strangle"
                    />
                    <div className="strategy-card-title">Long Strangle</div>
                  </div>
                  <div
                    className="strategy-card"
                    onClick={() => funSetStrategy("Short Strangle")}
                  >
                    <img
                      src={shortStrangleImg}
                      className="strategy-card-img"
                      alt="Short Strangle"
                    />
                    <div className="strategy-card-title">Short Strangle</div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      {/* Info modal start */}
      {show && (
        <InfoModal
          setShow={setShow}
          title="Login"
          message="Please login to continue."
        />
      )}
      {/* Info modal end */}
    </>
  );
};

export default Strategies;
