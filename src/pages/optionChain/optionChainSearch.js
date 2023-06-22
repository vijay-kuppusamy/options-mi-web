import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
//
import Select from "react-select";
import { IconRefresh } from "@tabler/icons";
//
import {
  getOptionChain,
  getOptionData,
} from "../../features/optionChain/optionChainSlice";
import { formatValue } from "../../business/Utils";

const OptionChainSearch = () => {
  //
  const dispatch = useDispatch();
  //
  let symbol = useSelector((state) => state.optionChain.symbol);
  let expiryDates = useSelector((state) => state.optionChain.expiryDates);
  let expiry = useSelector((state) => state.optionChain.expiry);
  let spotPrice = useSelector((state) => state.optionChain.spotPrice);
  let timestamp = useSelector((state) => state.optionChain.timestamp);
  //
  const symbols = useSelector((state) => state.settings.symbols);
  //
  const formValues = { symbol: symbol, expiry: expiry };
  const [fieldSymbol, setFieldSymbol] = useState(formValues.symbol);
  const [expiryDate, setExpiryDate] = useState(formValues.expiry);
  //console.log(formValues, expiryDate);
  const getSymbolOptions = (list) => {
    let options = [];
    if (list != null && list.length > 0) {
      list.forEach((item) => {
        options.push({ value: item.symbol, label: item.symbol });
      });
    }
    return options;
  };
  const symbolOptions = getSymbolOptions(symbols);

  const getExpiryOptions = (list) => {
    let options = [];
    if (list != null && list.length > 0) {
      list.forEach((item) => {
        options.push({ value: item, label: item });
      });
    }
    return options;
  };
  const expiryOptions = getExpiryOptions(expiryDates);
  //

  const onSymbolChange = (selected) => {
    formValues.symbol = selected.value;
    setFieldSymbol(formValues.expiry);
    dispatch(getOptionChain({ symbol: formValues.symbol }));
  };

  const onExpiryChange = (selected) => {
    formValues.expiry = selected.value;
    setExpiryDate(formValues.expiry);
    dispatch(getOptionData(formValues));
  };

  const funcRefresh = (event) => {
    event.preventDefault();
    dispatch(getOptionData(formValues));
  };

  useEffect(() => {
    setFieldSymbol(formValues.symbol);
    setExpiryDate(formValues.expiry);
  }, [formValues.expiry, formValues.symbol]);
  //
  return (
    <>
      <div className="row g-3 align-items-center">
        <div className="col-auto">
          <label htmlFor="symbols" className="search-label">
            Symbol
          </label>
        </div>
        <div className="col-md-2">
          <Select
            name="fieldSymbol"
            className="oc-search-select-symbol"
            value={{ value: fieldSymbol, label: fieldSymbol }}
            onChange={onSymbolChange}
            options={symbolOptions}
          />
        </div>
        <div className="col-auto">
          <label htmlFor="expiryDate" className="search-label">
            Expiry Date
          </label>
        </div>
        <div className="col-md-2">
          <Select
            name="expiryDate"
            className="oc-search-select-expiry"
            value={{ value: expiryDate, label: expiryDate }}
            onChange={onExpiryChange}
            options={expiryOptions}
          />
        </div>
        <div className="col-auto">
          <label htmlFor="SpotPrice" className="search-label">
            Current Price
          </label>
        </div>
        <div className="col-md-2">
          <span>{formatValue(spotPrice, "numeric")}</span>
        </div>
      </div>
      <div className="search-footer">
        <div className="timestamp">* Updated on {timestamp}</div>
        <div>
          <a
            href="."
            type="button"
            className="btn-action"
            onClick={funcRefresh}
          >
            <IconRefresh />
          </a>
        </div>
      </div>
    </>
  );
};

export default OptionChainSearch;
