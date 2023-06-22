import PayOff from "./PayOff";
const { getNearestStrike } = require("./Utils");
const { getOptionByExpiryNStrike } = require("./OptionChain");

function getInitposition() {
  return {
    index: 0,
    symbol: "",
    volume: "",
    premium: "",
    lastPrice: "",
    expiryDate: "",
    strikePrice: "",
    spotPrice: "",
    option: "",
    transaction: "",
    iv: "",
    lotSize: 0,
    contractSize: 0,
  };
}

function getCallOTMStrike(spotPrice, stepValue, steps) {
  let strikePrice = Math.round(spotPrice / stepValue) * stepValue;
  return strikePrice + stepValue * steps;
}

function getCallITMStrike(spotPrice, stepValue, steps) {
  let strikePrice = Math.round(spotPrice / stepValue) * stepValue;
  return strikePrice - stepValue * steps;
}

function getPutOTMStrike(spotPrice, stepValue, steps) {
  let strikePrice = Math.round(spotPrice / stepValue) * stepValue;
  return strikePrice - stepValue * steps;
}

function getPutITMStrike(spotPrice, stepValue, steps) {
  let strikePrice = Math.round(spotPrice / stepValue) * stepValue;
  return strikePrice + stepValue * steps;
}

function getCallPosition(index, data, lotSize, transaction, contractSize) {
  let position = getInitposition();
  if (data) {
    position.index = index;
    position.symbol = data.underlying;
    position.expiryDate = data.expiryDate;
    position.strikePrice = data.strikePrice;
    position.volume = data.callTradedVolume;
    position.premium = data.callLastPrice;
    position.lastPrice = data.callLastPrice;
    position.iv = data.callIV;
    position.spotPrice = data.underlyingValue;
    position.option = "Call";
    position.transaction = transaction;
    position.lotSize = lotSize;
    position.contractSize = contractSize;
  }
  return position;
}

function getPutPosition(index, data, lotSize, transaction, contractSize) {
  let position = getInitposition();
  if (data) {
    position.index = index;
    position.symbol = data.underlying;
    position.expiryDate = data.expiryDate;
    position.strikePrice = data.strikePrice;
    position.volume = data.putTradedVolume;
    position.premium = data.putLastPrice;
    position.lastPrice = data.putLastPrice;
    position.iv = data.putIV;
    position.spotPrice = data.underlyingValue;
    position.option = "Put";
    position.transaction = transaction;
    position.lotSize = lotSize;
    position.contractSize = contractSize;
  }
  return position;
}

//Buy Call strategy
function getBuyCall(optionData, expiry, strike, contractSize) {
  let positions = [];
  let data = getOptionByExpiryNStrike(optionData, expiry, strike);
  let position = getCallPosition(0, data, 1, "Buy", contractSize);
  positions.push(position);
  return positions;
}

//Sell Put strategy
function getSellPut(optionData, expiry, strike, contractSize) {
  let positions = [];
  let data = getOptionByExpiryNStrike(optionData, expiry, strike);
  let position = getPutPosition(0, data, 1, "Sell", contractSize);
  positions.push(position);
  return positions;
}

//Bull Call Spread strategy
function getBullCallSpread(
  optionData,
  expiry,
  strike,
  stepValue,
  contractSize
) {
  let data = getOptionByExpiryNStrike(optionData, expiry, strike);
  let positions = [];
  let position = getCallPosition(0, data, 1, "Buy", contractSize);
  positions.push(position);

  let otmStrike = getCallOTMStrike(strike, stepValue, 4);
  let otmData = getOptionByExpiryNStrike(optionData, expiry, otmStrike);
  let otmPosition = getCallPosition(1, otmData, 1, "Sell", contractSize);
  positions.push(otmPosition);

  return positions;
}

//Bull Put Spread strategy
function getBullPutSpread(optionData, expiry, strike, stepValue, contractSize) {
  let positions = [];

  // Buy 1 OTM Put option (leg 1)
  let otmStrike = getPutOTMStrike(strike, stepValue, 2);
  let otmData = getOptionByExpiryNStrike(optionData, expiry, otmStrike);
  let otmPosition = getPutPosition(0, otmData, 1, "Buy", contractSize);
  positions.push(otmPosition);

  // Sell 1 ITM Put option (leg 2)
  let itmStrike = getPutITMStrike(strike, stepValue, 2);
  let itmData = getOptionByExpiryNStrike(optionData, expiry, itmStrike);
  let itmPosition = getPutPosition(1, itmData, 1, "Sell", contractSize);
  positions.push(itmPosition);

  return positions;
}

// Call Ratio Back Spread
function getCallRatioBackSpread(
  optionData,
  expiry,
  strike,
  stepValue,
  contractSize
) {
  let positions = [];
  // Sell one lot of CE (ITM) - 3
  let callItmStrike = getCallITMStrike(strike, stepValue, 3);
  let callItmData = getOptionByExpiryNStrike(optionData, expiry, callItmStrike);
  let callItmPosition = getCallPosition(
    0,
    callItmData,
    1,
    "Sell",
    contractSize
  );
  positions.push(callItmPosition);

  // Buy two lots of CE (OTM) - 1
  let callOtmStrike = getCallOTMStrike(strike, stepValue, 1);
  let callOtmData = getOptionByExpiryNStrike(optionData, expiry, callOtmStrike);
  let callOtmPosition = getCallPosition(1, callOtmData, 2, "Buy", contractSize);
  positions.push(callOtmPosition);

  return positions;
}

//Bear Call Ladder
function getBearCallLadder(
  optionData,
  expiry,
  strike,
  stepValue,
  contractSize
) {
  let positions = [];
  // Sell one lot of CE (ITM) - 3
  let callItmStrike = getCallITMStrike(strike, stepValue, 3);
  let callItmData = getOptionByExpiryNStrike(optionData, expiry, callItmStrike);
  let callItmPosition = getCallPosition(
    0,
    callItmData,
    1,
    "Sell",
    contractSize
  );
  positions.push(callItmPosition);

  // Buy one lot of CE (ATM)
  let callAtmdata = getOptionByExpiryNStrike(optionData, expiry, strike);
  let callAtmposition = getCallPosition(1, callAtmdata, 1, "Buy", contractSize);
  positions.push(callAtmposition);

  // Buy one lot of CE (OTM) - 1
  let callOtmStrike = getCallOTMStrike(strike, stepValue, 1);
  let callOtmData = getOptionByExpiryNStrike(optionData, expiry, callOtmStrike);
  let callOtmPosition = getCallPosition(2, callOtmData, 1, "Buy", contractSize);
  positions.push(callOtmPosition);

  return positions;
}

//Bearish strategies
//Sell Call strategy
function getSellCall(optionData, expiry, strike, contractSize) {
  let positions = [];
  let callAtmData = getOptionByExpiryNStrike(optionData, expiry, strike);
  let position = getCallPosition(0, callAtmData, 1, "Sell", contractSize);
  positions.push(position);
  return positions;
}

//Buy Put strategy
function getBuyPut(optionData, expiry, strike, contractSize) {
  let positions = [];
  let putAtmData = getOptionByExpiryNStrike(optionData, expiry, strike);
  let putAtmposition = getPutPosition(0, putAtmData, 1, "Buy", contractSize);
  positions.push(putAtmposition);
  return positions;
}

//Bear Put Spread strategy
function getBearPutSpread(optionData, expiry, strike, stepValue, contractSize) {
  let positions = [];

  //Buy an ITM Put option
  let putItmStrike = getPutITMStrike(strike, stepValue, 2);
  let putItmData = getOptionByExpiryNStrike(optionData, expiry, putItmStrike);
  let putItmPosition = getPutPosition(0, putItmData, 1, "Buy", contractSize);
  positions.push(putItmPosition);

  //Sell an OTM Put option
  let putOtmStrike = getPutOTMStrike(strike, stepValue, 2);
  let putOtmData = getOptionByExpiryNStrike(optionData, expiry, putOtmStrike);
  let putOtmPosition = getPutPosition(1, putOtmData, 1, "Sell", contractSize);
  positions.push(putOtmPosition);

  return positions;
}

//Bear Call Spread  strategy
function getBearCallSpread(
  optionData,
  expiry,
  strike,
  stepValue,
  contractSize
) {
  let positions = [];

  //Buy 1 OTM Call option (leg 1)
  let callOtmStrike = getCallOTMStrike(strike, stepValue, 2);
  let callOtmData = getOptionByExpiryNStrike(optionData, expiry, callOtmStrike);
  let callOtmPosition = getCallPosition(0, callOtmData, 1, "Buy", contractSize);
  positions.push(callOtmPosition);

  //Sell 1 ITM Call option (leg 2)
  let callItmStrike = getCallITMStrike(strike, stepValue, 2);
  let callItmData = getOptionByExpiryNStrike(optionData, expiry, callItmStrike);
  let callItmPosition = getCallPosition(
    1,
    callItmData,
    1,
    "Sell",
    contractSize
  );
  positions.push(callItmPosition);

  return positions;
}

//Put Ratio Back spread
function getPutRatioBackSpread(
  optionData,
  expiry,
  strike,
  stepValue,
  contractSize
) {
  let positions = [];

  //Sell 1 ITM PE
  let putItmStrike = getPutITMStrike(strike, stepValue, 1);
  let putItmData = getOptionByExpiryNStrike(optionData, expiry, putItmStrike);
  let itmPosition = getPutPosition(0, putItmData, 1, "Sell", contractSize);
  positions.push(itmPosition);

  //Buy 2 lots OTM PE
  let putOtmStrike = getPutOTMStrike(strike, stepValue, 6);
  let putOtmData = getOptionByExpiryNStrike(optionData, expiry, putOtmStrike);
  let putOtmPosition = getPutPosition(1, putOtmData, 2, "Buy", contractSize);
  positions.push(putOtmPosition);

  return positions;
}

//Long Straddle
function getLongStraddle(optionData, expiry, strike, stepValue, contractSize) {
  let positions = [];

  //Buy a ATM Call option
  let callAtmdata = getOptionByExpiryNStrike(optionData, expiry, strike);
  let callAtmposition = getCallPosition(0, callAtmdata, 1, "Buy", contractSize);
  positions.push(callAtmposition);

  //Buy a ATM Put option
  let putAtmData = getOptionByExpiryNStrike(optionData, expiry, strike);
  let putAtmposition = getPutPosition(1, putAtmData, 1, "Buy", contractSize);
  positions.push(putAtmposition);

  return positions;
}

//Short Straddle
function getShortStraddle(optionData, expiry, strike, stepValue, contractSize) {
  let positions = [];

  //Sell a ATM Call option
  let callAtmdata = getOptionByExpiryNStrike(optionData, expiry, strike);
  let callAtmposition = getCallPosition(
    0,
    callAtmdata,
    1,
    "Sell",
    contractSize
  );
  positions.push(callAtmposition);

  //Sell a ATM Put option
  let putAtmData = getOptionByExpiryNStrike(optionData, expiry, strike);
  let putAtmposition = getPutPosition(1, putAtmData, 1, "Sell", contractSize);
  positions.push(putAtmposition);

  return positions;
}

//Long Strangle
function getLongStrangle(optionData, expiry, strike, stepValue, contractSize) {
  let positions = [];
  //Buy a OTM Call option
  let callOtmStrike = getCallOTMStrike(strike, stepValue, 4);
  let callOtmData = getOptionByExpiryNStrike(optionData, expiry, callOtmStrike);
  let callOtmPosition = getCallPosition(0, callOtmData, 1, "Buy", contractSize);
  positions.push(callOtmPosition);

  //Buy a OTM Put option
  let putOtmStrike = getPutOTMStrike(strike, stepValue, 4);
  let putOtmData = getOptionByExpiryNStrike(optionData, expiry, putOtmStrike);
  let putOtmPosition = getPutPosition(1, putOtmData, 1, "Buy", contractSize);
  positions.push(putOtmPosition);

  return positions;
}

//Short Strangle
function getShortStrangle(optionData, expiry, strike, stepValue, contractSize) {
  let positions = [];
  //Sell a OTM Call option
  let callOtmStrike = getCallOTMStrike(strike, stepValue, 4);
  let callOtmData = getOptionByExpiryNStrike(optionData, expiry, callOtmStrike);
  let callOtmPosition = getCallPosition(
    0,
    callOtmData,
    1,
    "Sell",
    contractSize
  );
  positions.push(callOtmPosition);

  //Sell a OTM Put option
  let putOtmStrike = getPutOTMStrike(strike, stepValue, 4);
  let putOtmData = getOptionByExpiryNStrike(optionData, expiry, putOtmStrike);
  let putOtmPosition = getPutPosition(1, putOtmData, 1, "Sell", contractSize);
  positions.push(putOtmPosition);

  return positions;
}

export const getStrategyPosition = (
  strategy,
  optionData,
  expiry,
  spotPrice,
  underlyingConfig
) => {
  //
  let stepValue = underlyingConfig.stepValue;
  let contractSize = underlyingConfig.lotSize;
  let strike = getNearestStrike(spotPrice, stepValue);

  let positions = [];
  switch (strategy) {
    //Bullish strategies
    case "Buy Call":
      positions = getBuyCall(optionData, expiry, strike, contractSize);
      break;
    case "Sell Put":
      positions = getSellPut(optionData, expiry, strike, contractSize);
      break;
    case "Bull Call Spread":
      positions = getBullCallSpread(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Bull Put Spread":
      positions = getBullPutSpread(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Call Ratio Back Spread":
      positions = getCallRatioBackSpread(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Bear Call Ladder":
      positions = getBearCallLadder(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    //Bearish strategies
    case "Sell Call":
      positions = getSellCall(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Buy Put":
      positions = getBuyPut(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Bear Put Spread":
      positions = getBearPutSpread(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Bear Call Spread":
      positions = getBearCallSpread(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Put Ratio Back Spread":
      positions = getPutRatioBackSpread(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Long Straddle":
      positions = getLongStraddle(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Short Straddle":
      positions = getShortStraddle(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Long Strangle":
      positions = getLongStrangle(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    case "Short Strangle":
      positions = getShortStrangle(
        optionData,
        expiry,
        strike,
        stepValue,
        contractSize
      );
      break;
    default:
      positions = getBuyCall(optionData, expiry, strike, contractSize);
      break;
  }
  return positions;
};

export const getPayOff = (positions, underlyingConfig) => {
  if (positions && positions.length > 0) {
    let payOff = new PayOff(positions, underlyingConfig);
    let pl = payOff.calculatePositionsProfitLoss();
    let maxPL = payOff.calculateMaxProfitLoss();
    let breakEven = payOff.calculateBreakEven();
    let prob = payOff.calculateProbability();
    let sd = payOff.calculateStandardDeviation();
    let netCreditDebit = payOff.calculateDebitCredit();
    //
    let payOffValues = {
      ...pl,
      ...maxPL,
      ...breakEven,
      ...prob,
      ...sd,
      ...netCreditDebit,
    };
    //console.log(payOffValues);
    return payOffValues;
  } else {
    return {};
  }
};
