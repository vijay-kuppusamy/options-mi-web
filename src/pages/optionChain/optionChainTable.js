import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Select from "react-select";
import Modal from "react-bootstrap/Modal";
//
import ChainDetails from "./chainDetails";
import { formatValue, getNearestStrike } from "../../business/Utils";

function getStrikeOptions() {
  return [
    { value: "50", label: "50" },
    { value: "100", label: "100" },
    { value: "All", label: "All" },
  ];
}

const OptionChainTable = () => {
  //
  let { optionData, spotPrice, underlyingConfig } = useSelector(
    (state) => state.optionChain
  );

  const formValues = { strike: "50" };
  const [strike, setStrike] = useState(formValues.strike);
  const strikeOptions = getStrikeOptions();

  const price = getNearestStrike(spotPrice, underlyingConfig.stepValue);

  const onStrikeChange = (selected) => {
    // formValues.strike = selected.value;
    // setStrike(formValues.strike);
  };

  //
  const bgCall = (strikePrice, value) => {
    let bgStyle = isCallItm(strikePrice);
    bgStyle = bgStyle + " " + isPositive(value);
    return bgStyle;
  };

  const bgPut = (strikePrice, value) => {
    let bgStyle = isPUTItm(strikePrice);
    bgStyle = bgStyle + " " + isPositive(value);
    return bgStyle;
  };

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

  const isPositive = (value) => {
    value = Number(value) ? value : "";
    if (value > 0) {
      return "bg-positive";
    } else {
      return "bg-negative";
    }
  };
  //
  const [show, setShow] = useState(false);
  const [chainData, setChainData] = useState({});
  const handleClose = () => setShow(false);

  const strikePriceDetails = (data) => {
    setChainData(data);
    setShow(true);
  };
  //

  useEffect(() => {
    setStrike(formValues.strike);
  }, [formValues.strike]);

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
                  OI
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  OI Chg
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  OI Chg %
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Volume
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Change
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
                  Change
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  Volume
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  OI Chg %
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  OI Chg
                </th>
                <th style={{ backgroundColor: "#8080ff", color: "white" }}>
                  OI
                </th>
              </tr>
            </thead>
            <tbody>
              {optionData?.map((data) => (
                <tr key={data.strikePrice}>
                  <td className={isCallItm(data?.strikePrice)}>
                    {formatValue(data?.callOI, "numeric")}
                  </td>
                  <td className={bgCall(data?.strikePrice, data?.callOIChg)}>
                    {formatValue(data?.callOIChg, "numeric")}
                  </td>
                  <td className={bgCall(data?.strikePrice, data?.callOIChgPct)}>
                    {formatValue(data?.callOIChgPct, "percentage")}
                  </td>
                  <td className={isCallItm(data?.strikePrice)}>
                    {formatValue(data?.callTradedVolume, "numeric")}
                  </td>
                  <td className={bgCall(data?.strikePrice, data?.callPriceChg)}>
                    {formatValue(data?.callPriceChg, "fixed")}
                  </td>
                  <td className={isCallItm(data?.strikePrice)}>
                    {formatValue(data?.callLastPrice, "price")}
                  </td>
                  <td className={isCallItm(data?.strikePrice)}>
                    {formatValue(data?.callIV, "fixed")}
                  </td>
                  <td
                    onClick={() => strikePriceDetails(data)}
                    className="bg-strike"
                  >
                    {data?.strikePrice}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {formatValue(data?.putIV, "price")}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {formatValue(data?.putLastPrice, "price")}
                  </td>
                  <td className={bgPut(data?.strikePrice, data?.putPriceChg)}>
                    {formatValue(data?.putPriceChg, "fixed")}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {formatValue(data?.putTradedVolume, "numeric")}
                  </td>
                  <td className={bgPut(data?.strikePrice, data?.putOIChgPct)}>
                    {formatValue(data?.putOIChgPct, "percentage")}
                  </td>
                  <td className={bgPut(data?.strikePrice, data?.putOIChg)}>
                    {formatValue(data?.putOIChg, "numeric")}
                  </td>
                  <td className={isPUTItm(data?.strikePrice)}>
                    {formatValue(data?.putOI, "numeric")}
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

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Strike Price Details : {chainData.strikePrice}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChainDetails chainData={chainData} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OptionChainTable;
