import Table from "react-bootstrap/Table";

import { calculateGreeks } from "../../business/blackScholes";

function formatValue(value, format) {
  if (
    !value ||
    value === 0 ||
    value === "0" ||
    value === "NaN" ||
    value === undefined ||
    value === null
  )
    return "-";

  value = (value * 100).toFixed(2);
  return value;
}

function getDetails(data) {
  //
  let details = {
    callBidQty: "",
    callBidPrice: "",
    callAskQty: "",
    callAskPrice: "",
    callDelta: "",
    callTheta: "",
    callVega: "",
    callGamma: "",
    putBidQty: "",
    putBidPrice: "",
    putAskQty: "",
    putAskPrice: "",
    putDelta: "",
    putTheta: "",
    putVega: "",
    putGamma: "",
  };

  let greeks = calculateGreeks(
    data.underlyingValue,
    data.strikePrice,
    data.expiryDate,
    data.callIV,
    7,
    0
  );

  details.callBidQty = data.callBidQty;
  details.callBidPrice = data.callBidprice;
  details.callAskQty = data.callAskQty;
  details.callAskPrice = data.callAskPrice;
  details.putBidQty = data.putBidQty;
  details.putBidPrice = data.putBidprice;
  details.putAskQty = data.putAskQty;
  details.putAskPrice = data.putAskPrice;

  details.callDelta = formatValue(greeks.call_delta);
  details.putDelta = formatValue(greeks.put_delta);
  details.callGamma = formatValue(greeks.call_gamma);
  details.putGamma = formatValue(greeks.put_gamma);
  details.callTheta = formatValue(greeks.call_theta);
  details.putTheta = formatValue(greeks.put_theta);
  details.callVega = formatValue(greeks.call_vega);
  details.putVega = formatValue(greeks.put_vega);

  return details;
}

const ChainDetails = (props) => {
  //
  let data = props.chainData;
  let chainData = getDetails(data);
  return (
    <div className="chain-table">
      <Table size="sm" bordered hover>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#8080ff", color: "white" }}>Call</th>
            <th style={{ backgroundColor: "#8080ff", color: "white" }}></th>
            <th style={{ backgroundColor: "#8080ff", color: "white" }}>Put</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{chainData?.callBidQty}</td>
            <td>Bid Qty</td>
            <td>{chainData?.putBidQty}</td>
          </tr>
          <tr>
            <td>{chainData?.callBidPrice}</td>
            <td>Bid Price</td>
            <td>{chainData?.putBidPrice}</td>
          </tr>
          <tr>
            <td>{chainData?.callAskQty}</td>
            <td>Ask Qty</td>
            <td>{chainData?.putAskQty}</td>
          </tr>
          <tr>
            <td>{chainData?.callAskPrice}</td>
            <td>Ask Price</td>
            <td>{chainData?.putAskPrice}</td>
          </tr>
          <tr>
            <td>{chainData?.callDelta}</td>
            <td>Delta</td>
            <td>{chainData?.putDelta}</td>
          </tr>
          <tr>
            <td>{chainData?.callTheta}</td>
            <td>Theta</td>
            <td>{chainData?.putTheta}</td>
          </tr>
          <tr>
            <td>{chainData?.callVega}</td>
            <td>Vega</td>
            <td>{chainData?.putVega}</td>
          </tr>
          <tr>
            <td>{chainData?.callGamma}</td>
            <td>Gamma</td>
            <td>{chainData?.putGamma}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ChainDetails;
