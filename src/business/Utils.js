const { DateTime } = require("luxon");

export const formatValue = (value, format) => {
  if (
    !value ||
    value === 0 ||
    value === "0" ||
    value === undefined ||
    value === null
  )
    return "-";
  if (format === "numeric") return value.toLocaleString("en-IN");
  if (format === "fixed") return value.toFixed(2);
  if (format === "percentage") return value.toFixed(2) + "%";
  if (format === "price") return value.toFixed(2).toLocaleString("en-IN");
  return value;
};

export const formatNumValue = (value, format) => {
  //console.log(value);
  if (!value || value === undefined || value === null) return "-";
  if (value === "N/A" || value === "Unlimited" || Number.isNaN(value))
    return value;
  if (format === "numeric") return value.toLocaleString("en-IN");
  if (format === "fixed") return value.toFixed(2);
  if (format === "percentage") return value.toFixed(2) + "%";
  if (format === "price")
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value));
  return value;
};

export const getNearestStrike = (spotPrice, stepValue) => {
  return Math.round(spotPrice / stepValue) * stepValue;
};

function isBetween(low, high, value) {
  return value >= low && value < high;
}

export const getRoundedVal = (value) => {
  if (isBetween(0, 10, value)) {
    return Math.ceil(value / 1) * 1;
  }
  if (isBetween(10, 100, value)) {
    return Math.ceil(value / 10) * 10;
  }
  if (isBetween(100, 1000, value)) {
    return Math.ceil(value / 100) * 100;
  }
  if (isBetween(1000, 10000, value)) {
    return Math.ceil(value / 1000) * 1000;
  }
  if (isBetween(10000, 100000, value)) {
    return Math.ceil(value / 10000) * 10000;
  }
};

export const getExpiryDate = (expiryDates) => {
  let expiry = null;
  if (expiryDates && expiryDates?.length > 2) {
    let days = daysRemaining(expiryDates[0]);
    if (days > 1) {
      return expiryDates[0];
    } else {
      return expiryDates[1];
    }
  }
  return expiry;
};

export const daysRemaining = (expiry) => {
  const monthMap = new Map([
    ["jan", "01"],
    ["feb", "02"],
    ["mar", "03"],
    ["apr", "04"],
    ["may", "05"],
    ["jun", "06"],
    ["jul", "07"],
    ["aug", "08"],
    ["sep", "09"],
    ["oct", "10"],
    ["nov", "11"],
    ["dec", "12"],
  ]);

  let days = 0;
  if (expiry) {
    try {
      const now = DateTime.now().toString();
      const startDate = now.split("T")[0];

      const expiryArray = expiry.split("-");
      let d = expiryArray[0];
      let m = monthMap.get(expiryArray[1].toLowerCase());
      let y = expiryArray[2];
      let endDate = y + "-" + m + "-" + d;

      days = DateTime.fromISO(endDate)
        .diff(DateTime.fromISO(startDate), "days")
        .toObject().days;
    } catch (error) {
      console.log(error);
    }
  }
  return days;
};
