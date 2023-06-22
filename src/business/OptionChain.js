import jsonata from "jsonata";
import { calculateGreeks } from "./blackScholes";

function getGreekObj() {
  return {
    callDelta: "",
    putDelta: "",
    callGamma: "",
    putGamma: "",
    callVega: "",
    putVega: "",
    callTheta: "",
    putTheta: "",
    callRho: "",
    putRho: "",
    spotPrice: "",
    callIV: "",
    putIV: "",
    callLTP: "",
    putLTP: "",
    callVolume: "",
    putVolume: "",
  };
}

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

function getOptionGreeks(optionData, spotPrice, strikes, stepValue) {
  let optionGreeks = [];

  if (!optionData) return optionGreeks;

  if (optionData && optionData?.length > 0) {
    for (let index = 0; index < optionData.length; index++) {
      let greekObj = getGreekObj();
      const element = optionData[index];

      //need to update the hard coded values
      let greeks = calculateGreeks(
        element.underlyingValue,
        element.strikePrice,
        element.expiryDate,
        element.callIV,
        7.25,
        0
      );

      if (greeks) {
        greekObj.callDelta = formatValue(greeks.call_delta);
        greekObj.putDelta = formatValue(greeks.put_delta);
        greekObj.callGamma = formatValue(greeks.call_gamma);
        greekObj.putGamma = formatValue(greeks.put_gamma);
        greekObj.callTheta = formatValue(greeks.call_theta);
        greekObj.putTheta = formatValue(greeks.put_theta);
        greekObj.callRho = formatValue(greeks.call_rho);
        greekObj.putRho = formatValue(greeks.put_rho);
        greekObj.callVega = formatValue(greeks.call_vega);
        greekObj.putVega = formatValue(greeks.put_vega);
      }

      greekObj.strikePrice = element.strikePrice;
      greekObj.callIV = element.callIV;
      greekObj.putIV = element.putIV;
      greekObj.callLTP = element.callLastPrice;
      greekObj.putLTP = element.putLastPrice;
      greekObj.callVolume = element.callTradedVolume;
      greekObj.putVolume = element.putTradedVolume;
      optionGreeks.push(greekObj);
    }
  }
  return optionGreeks;
}

function getOptionByExpiryNStrike(optionData, expiry, strike) {
  const oData = { optionData: optionData };
  var expQuery =
    "optionData[expiryDate='" + expiry + "' and strikePrice = " + strike + "]";
  const optionDataExp = jsonata(expQuery);
  const data = optionDataExp.evaluate(oData);
  return data;
}

export { getOptionGreeks, getOptionByExpiryNStrike };
