import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import PositionAnalysis from "./positionAnalysis";
import PayoffChart from "./payoffChart";

import { getPayOff } from "../../business/StrategyBuilder";

const Payoff = () => {
  //
  const underlyingConfig = useSelector(
    (state) => state.optionChain.underlyingConfig
  );
  const positions = useSelector((state) => state.strategyBuilder.positions);

  const [values, setValues] = useState(null);

  useEffect(() => {
    if (positions && positions.length > 0) {
      let data = getPayOff(positions, underlyingConfig);
      setValues(data);
    } else {
      setValues(null);
    }
  }, [positions, underlyingConfig]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Payoff</h3>
        </div>
        <div className="card-body border-bottom">
          <div>
            <PositionAnalysis values={values} />
          </div>
          <div>
            <div>
              <h3 className="card-title">Payoff Chart</h3>
            </div>
            <div>{values && <PayoffChart values={values} />}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payoff;
