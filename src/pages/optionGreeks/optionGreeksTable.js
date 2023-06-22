import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Select from "react-select";
//
import { getOptionGreeks } from "../../business/OptionChain";
import { formatValue, getNearestStrike } from "../../business/Utils";

function getStrikeOptions() {
  return [
    { value: "50", label: "50" },
    { value: "100", label: "100" },
    { value: "All", label: "All" },
  ];
}

const OptionGreeksTable = () => {
  //
  let { optionData, spotPrice, underlyingConfig } = useSelector(
    (state) => state.optionChain
  );

  const formValues = { strike: "50" };
  const [strike, setStrike] = useState(formValues.strike);
  const strikeOptions = getStrikeOptions();

  const onStrikeChange = (selected) => {
    // formValues.strike = selected.value;
    // setStrike(formValues.strike);
  };

  const price = getNearestStrike(spotPrice, underlyingConfig.stepValue);
  let oData = getOptionGreeks(
    optionData,
    price,
    strike,
    underlyingConfig.stepValue
  );
  //

  //
  const isCallItm = (strikePrice) => {
    if (strikePrice < price) return "bg-itm";
    if (strikePrice === price) return "bg-strike";
    return "";
  };

  const isPUTItm = (strikePrice) => {
    if (strikePrice > price) return "bg-itm";
    if (strikePrice === price) return "bg-strike";
    return "";
  };
  //
  useEffect(() => {
    setStrike(formValues.strike);
  }, [formValues.strike]);
  //
  return (
    <>
      <div className="option-page">
        <div className="option-table">
          <table className="table table-sm table-hover table-bordered">
            <thead className="sticky">
              <tr>
                <th
                  style={{ backgroundColor: "#8080ff", color: "white" }}
                  colSpan="7"
                >
                  Calls
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}></th>
                <th
                  style={{ backgroundColor: "#8080ff", color: "white" }}
                  colSpan="7"
                >
                  Puts
                </th>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Vega
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Theta
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Gamma
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Delta
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Volume
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  LTP
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  IV
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Strike Price
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  IV
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  LTP
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Volume
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Delta
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Gamma
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Theta
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Vega
                </th>
              </tr>
            </thead>
            <tbody>
              {oData?.map((data) => (
                <tr key={data.strikePrice}>
                  <td className={isCallItm(data?.strikePrice)}>
                    {data.callVega}
                  </td>
                  <td className={isCallItm(data?.strikePrice)}>
                    {data.callTheta}
                  </td>
                  <td className={isCallItm(data?.strikePrice)}>
                    {data.callGamma}
                  </td>
                  <td className={isCallItm(data?.strikePrice)}>
                    {data.callDelta}
                  </td>
                  <td className={isCallItm(data?.strikePrice)}>
                    {formatValue(data?.callVolume, "numeric")}
                  </td>
                  <td className={isCallItm(data?.strikePrice)}>
                    {formatValue(data?.callLTP, "price")}
                  </td>
                  <td className={isCallItm(data?.strikePrice)}>
                    {formatValue(data?.callIV, "fixed")}
                  </td>
                  <td className="bg-strike">{data?.strikePrice}</td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {formatValue(data?.putIV, "price")}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {formatValue(data?.putLTP, "price")}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {formatValue(data?.putVolume, "numeric")}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {data.putDelta}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {data.putGamma}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {data.putTheta}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {data.putVega}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row g-3 display-strike">
        <div className="col-auto">
          <span id="passwordHelpInline" className="form-text">
            Display
          </span>
        </div>
        <div className="col-auto">
          <Select
            name="strike"
            className="oc-search-select-strike"
            value={{ value: strike, label: strike }}
            options={strikeOptions}
            onChange={onStrikeChange}
          />
        </div>
        <div className="col-auto">
          <span id="passwordHelpInline" className="form-text">
            Strikes
          </span>
        </div>
      </div>
    </>
  );
};

export default OptionGreeksTable;
