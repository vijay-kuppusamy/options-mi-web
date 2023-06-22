/**
 * Option Payoff calculation
 *
 * Premium - Option Buy Price
 * Strike Price - Option Strike Price
 * Spot Price - Option Underlying Current Price
 * options - Call or Put
 * transaction - Buy or Sell
 * IV - Implied Volatility
 * expiryDate - Expiry Date
 * 
 * Input 
 *  let position = {
      premium: 0.95,
      strikePrice: 45,
      spotPrice: 54,
      option: 'Put',
      transaction: 'Buy',
      iv: '',
      expiryDate: '',
      lotSize: 5,
      contractSize: 100
    };
*/

const { calculateGreeks } = require("./blackScholes");
const { daysRemaining, getNearestStrike } = require("./Utils");

export default class PayOff {
  constructor(positions, underlyingConfig) {
    this.positions = positions;
    this.underlyingConfig = underlyingConfig;
    this.priceList = [];
    this.profitLossList = [];
  }

  positionProfitLossByPrice(position, price) {
    let pl = 0;
    if (position.option === "Call" && position.transaction === "Buy") {
      pl = Math.max(0, price - position.strikePrice) - position.premium;
    }
    if (position.option === "Call" && position.transaction === "Sell") {
      pl = position.premium - Math.max(0, price - position.strikePrice);
    }
    if (position.option === "Put" && position.transaction === "Buy") {
      pl = Math.max(0, position.strikePrice - price) - position.premium;
    }
    if (position.option === "Put" && position.transaction === "Sell") {
      pl = position.premium - Math.max(0, position.strikePrice - price);
    }
    return pl;
  }

  positionTheoriticalProfitLossByPrice(position, price) {
    try {
      let result = calculateGreeks(
        price,
        position.strikePrice,
        position.expiryDate,
        position.iv,
        7,
        0
      );

      if (position.option === "Call" && position.transaction === "Buy") {
        return result.call_premium - position.premium;
      }
      if (position.option === "Call" && position.transaction === "Sell") {
        return (result.call_premium - position.premium) * -1;
      }
      if (position.option === "Put" && position.transaction === "Buy") {
        return result.put_premium - position.premium;
      }
      if (position.option === "Put" && position.transaction === "Sell") {
        return (result.put_premium - position.premium) * -1;
      }
    } catch (error) {
      throw new Error(error);
    }
    return 0;
  }

  isBetween(low, high, value) {
    return value >= low && value < high;
  }

  round(value) {
    if (this.isBetween(0, 10, value)) {
      return Math.ceil(value / 1) * 1;
    }
    if (this.isBetween(10, 100, value)) {
      return Math.ceil(value / 10) * 10;
    }
    if (this.isBetween(100, 1000, value)) {
      return Math.ceil(value / 100) * 100;
    }
    if (this.isBetween(1000, 10000, value)) {
      return Math.ceil(value / 1000) * 1000;
    }
    if (this.isBetween(10000, 100000, value)) {
      return Math.ceil(value / 10000) * 10000;
    }
  }

  calculatePricePoints(spotPrice) {
    spotPrice = getNearestStrike(spotPrice, this.underlyingConfig.stepValue);

    // start and end price points will be calculated based on this value, 10% from the value
    let boundry = this.round((spotPrice * 10) / 100);
    // step value will be calculated based on this value, 10% from the value
    let step = this.round((boundry * 1) / 100);
    return { boundry: boundry, step: step };
  }

  calculatePositionsProfitLoss() {
    this.priceList = [];
    this.profitLossList = [];
    let theoriticalProfitLossList = [];

    if (this.positions.length > 0) {
      let spotPrice = getNearestStrike(
        this.positions[0].spotPrice,
        this.underlyingConfig.stepValue
      );
      let pricePoints = this.calculatePricePoints(spotPrice);
      //console.log(pricePoints);
      let startPrice = spotPrice - pricePoints.boundry;
      let endPrice = spotPrice + pricePoints.boundry;
      let increment = pricePoints.step;

      for (
        let price = startPrice;
        price <= endPrice;
        price = price + increment
      ) {
        this.priceList.push(price);
        let plTotal = 0;
        let theoriticalplTotal = 0;
        this.positions.forEach((position) => {
          let pl =
            this.positionProfitLossByPrice(position, price) *
            position.contractSize *
            position.lotSize;
          plTotal = plTotal + pl;
          let result = 0;
          try {
            result = this.positionTheoriticalProfitLossByPrice(position, price);
            //console.log(this.positionProfitLossByPrice(position, price), result);
            let theoriticalpl =
              result * position.contractSize * position.lotSize;
            theoriticalplTotal = theoriticalplTotal + theoriticalpl;
          } catch (error) {
            console.log(error);
          }
        });
        this.profitLossList.push(parseFloat(plTotal.toFixed(2)));
        theoriticalProfitLossList.push(
          parseFloat(theoriticalplTotal.toFixed(2))
        );
      }
    }
    return {
      priceList: this.priceList,
      profitLossList: this.profitLossList,
      theoriticalProfitLossList,
    };
  }

  getMaxProfit() {
    let length = this.profitLossList.length;
    let first = this.profitLossList[0];
    let second = this.profitLossList[1];
    let beforeLast = this.profitLossList[length - 2];
    let last = this.profitLossList[length - 1];
    if (last > beforeLast) {
      return "Unlimited";
    } else {
      if (first > second) {
        return "Unlimited";
      } else {
        return Math.max(...this.profitLossList);
      }
    }
  }

  getMaxLoss() {
    let length = this.profitLossList.length;
    let first = this.profitLossList[0];
    let second = this.profitLossList[1];
    let beforeLast = this.profitLossList[length - 2];
    let last = this.profitLossList[length - 1];

    if (last < beforeLast) {
      return "Unlimited";
    } else {
      if (first < second) {
        return "Unlimited";
      } else {
        return Math.min(...this.profitLossList);
      }
    }
  }

  getRiskRewardRatio(profit, loss) {
    let ratio = "N/A";
    if (profit > 0 && Math.abs(loss) > 0) {
      ratio = profit / Math.abs(loss);
    }
    return ratio;
  }

  calculateMaxProfitLoss() {
    const maxProfit = this.getMaxProfit();
    const maxLoss = this.getMaxLoss();
    const riskRewardRatio = this.getRiskRewardRatio(maxProfit, maxLoss);
    return { maxProfit, maxLoss, riskRewardRatio };
  }

  calculateBreakEven() {
    let strikePriceList = [0];
    this.positions.forEach((position) => {
      strikePriceList.push(position.strikePrice);
    });
    strikePriceList.push(1000000000);
    strikePriceList = strikePriceList.sort((a, b) => a - b);
    let priceList = [];
    let profitLossList = [];
    strikePriceList.forEach((price) => {
      priceList.push(price);
      let plTotal = 0;
      this.positions.forEach((position) => {
        let pl =
          this.positionProfitLossByPrice(position, price) *
          position.contractSize *
          position.lotSize;
        plTotal = plTotal + pl;
      });
      profitLossList.push(parseFloat(plTotal.toFixed(2)));
    });
    // console.log(priceList);
    // console.log(profitLossList);
    let length = profitLossList.length;
    let isSameSign = false;
    let breakEvenList = [];
    for (let i = 1; i < length; i++) {
      let be = 0;
      isSameSign =
        Math.sign(profitLossList[i - 1]) === Math.sign(profitLossList[i]);
      //console.log(profitLossList[i - 1], profitLossList[i], isSameSign);
      if (!isSameSign) {
        be =
          priceList[i - 1] +
          ((priceList[i] - priceList[i - 1]) * (0 - profitLossList[i - 1])) /
            (profitLossList[i] - profitLossList[i - 1]);

        breakEvenList.push(be);
      }
    }
    return { breakEvenList };
  }

  calculateDebitCredit() {
    let credit = 0;
    let debit = 0;
    let netCreditDebit = 0;

    this.positions.forEach((position) => {
      if (position.option === "Call" && position.transaction === "Buy") {
        let amount =
          position.premium * position.contractSize * position.lotSize;
        debit = debit + amount;
      }
      if (position.option === "Call" && position.transaction === "Sell") {
        let amount =
          position.premium * position.contractSize * position.lotSize;
        credit = credit + amount;
      }
      if (position.option === "Put" && position.transaction === "Buy") {
        let amount =
          position.premium * position.contractSize * position.lotSize;
        debit = debit + amount;
      }
      if (position.option === "Put" && position.transaction === "Sell") {
        let amount =
          position.premium * position.contractSize * position.lotSize;
        credit = credit + amount;
      }
    });
    netCreditDebit = credit - debit;
    return { credit, debit, netCreditDebit };
  }

  calculatePositionProbability(position) {
    var p = position.spotPrice;
    var q = position.strikePrice;
    var v = position.iv;
    var expiry = position.expiryDate;

    let days = daysRemaining(expiry);
    var t = days / 365;

    var vt = v * Math.sqrt(t);
    var lnpq = Math.log(q / p);

    var d1 = lnpq / vt;

    var y = Math.floor((1 / (1 + 0.2316419 * Math.abs(d1))) * 100000) / 100000;
    var z =
      Math.floor(0.3989423 * Math.exp(-((d1 * d1) / 2)) * 100000) / 100000;
    var y5 = 1.330274 * Math.pow(y, 5);
    var y4 = 1.821256 * Math.pow(y, 4);
    var y3 = 1.781478 * Math.pow(y, 3);
    var y2 = 0.356538 * Math.pow(y, 2);
    var y1 = 0.3193815 * y;
    var x = 1 - z * (y5 - y4 + y3 - y2 + y1);
    x = Math.floor(x * 100000) / 100000;

    if (d1 < 0) {
      x = 1 - x;
    }

    var pabove = Math.floor(x * 1000) / 10;
    //var pbelow = Math.floor((1 - x) * 1000) / 10;
    //console.log([[pbelow], [pabove]]);
    //return [[pbelow], [pabove]];
    return pabove;
  }

  calculateProbability() {
    let prob = 0;
    let total = this.positions.length;
    this.positions.forEach((position) => {
      let result = this.calculatePositionProbability(position);
      prob = prob + result;
    });
    prob = prob / total;
    return { probability: prob };
  }

  calculateStandardDeviation() {
    let sd = 0;
    let days = 0;
    let stockPrice = 0;
    if (this.positions.length > 0) {
      let position = this.positions[0];
      stockPrice = position.spotPrice;
      let expiry = position.expiryDate;
      let iv = position.iv;
      days = daysRemaining(expiry);
      if (days === 0) return 0;
      //console.log(stockPrice, days, iv);
      try {
        sd = (stockPrice * (iv / 100) * Math.sqrt(days)) / Math.sqrt(252);
      } catch (error) {
        console.log(error);
      }
    }
    sd = parseInt(sd);
    return {
      standardDeviation: sd,
      daysRemaining: days,
      spotPrice: stockPrice,
    };
  }
}
