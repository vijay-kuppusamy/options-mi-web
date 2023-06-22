import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

import { getStrategyPosition } from "../../business/StrategyBuilder";
import { addPosition } from "../../features/builtinStrategies/builtinStrategySlice";
import {
  getOptionChain,
  getOptionData,
} from "../../features/optionChain/optionChainSlice";
import {
  saveWatchlist,
  watchlistReset,
} from "../../features/watchlist/watchlistSlice";
import {
  savePortfolio,
  portfolioReset,
} from "../../features/portfolio/portfolioSlice";
import PayoffTable from "./PayoffTable";

const PayOffPage = () => {
  //
  const dispatch = useDispatch();
  //
  const symbol = useSelector((state) => state.optionChain.symbol);
  const expiry = useSelector((state) => state.optionChain.expiry);
  const expiryDates = useSelector((state) => state.optionChain.expiryDates);
  const optionData = useSelector((state) => state.optionChain.optionData);
  const spotPrice = useSelector((state) => state.optionChain.spotPrice);
  const underlyingConfig = useSelector(
    (state) => state.optionChain.underlyingConfig
  );
  const symbols = useSelector((state) => state.settings.symbols);

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
  const formValues = { symbol: symbol, expiry: expiry };
  const [fieldSymbol, setFieldSymbol] = useState(formValues.symbol);
  const [expiryDate, setExpiryDate] = useState(formValues.expiry);

  const onSymbolChange = (selected) => {
    formValues.symbol = selected.value;
    setFieldSymbol(formValues.expiry);
    dispatch(getOptionChain({ symbol: formValues.symbol }));
  };

  const onExpiryChange = (selected) => {
    formValues.expiry = selected.value;
    setExpiryDate(selected.value);
    dispatch(getOptionData(formValues));
  };

  let strategy = useSelector((state) => state.builtinStrategy.strategy);
  if (!strategy) strategy = "Buy Call";
  //
  let positions = useSelector((state) => state.builtinStrategy.positions);
  //
  let watchlistStatus = useSelector((state) => state.watchlist.watchlistStatus);
  let watchlistMessage = useSelector(
    (state) => state.watchlist.watchlistMessage
  );

  const addToWatchlist = () => {
    if (positions && positions.length > 0) {
      dispatch(saveWatchlist(positions));
    } else {
      toast.error("Please add positions to add to watchlist");
    }
  };
  //

  let portfolioStatus = useSelector((state) => state.portfolio.portfolioStatus);
  let portfolioMessage = useSelector(
    (state) => state.portfolio.portfolioMessage
  );

  const addToPortfolio = () => {
    if (positions && positions.length > 0) {
      dispatch(savePortfolio(positions));
    } else {
      toast.error("Please add positions to add to portfolio");
    }
  };
  //
  useEffect(() => {
    setFieldSymbol(formValues.symbol);
    setExpiryDate(formValues.expiry);
    if (optionData && expiry) {
      let positions = getStrategyPosition(
        strategy,
        optionData,
        expiry,
        spotPrice,
        underlyingConfig
      );
      if (positions && positions.length > 0) {
        dispatch(addPosition(positions));
      }
    }
    if (watchlistStatus === "succeeded" && watchlistMessage) {
      toast.success(watchlistMessage);
    }
    if (watchlistStatus === "failed" && watchlistMessage) {
      toast.error(watchlistMessage);
    }
    if (portfolioStatus === "succeeded" && portfolioMessage) {
      toast.success(portfolioMessage);
    }
    if (portfolioStatus === "failed" && portfolioMessage) {
      toast.error(portfolioMessage);
    }
    return () => {
      dispatch(watchlistReset());
      dispatch(portfolioReset());
    };
  }, [
    dispatch,
    expiry,
    strategy,
    optionData,
    spotPrice,
    underlyingConfig,
    formValues.symbol,
    formValues.expiry,
    watchlistStatus,
    watchlistMessage,
    portfolioStatus,
    portfolioMessage,
  ]);

  return (
    <>
      {watchlistStatus === "pending" && (
        <div className="overlay">
          <div className="center-screen">
            <Oval
              color="#206bc4"
              secondaryColor="#659fe6"
              strokeWidth={4}
              height={65}
              width={65}
            />
          </div>
        </div>
      )}

      <ToastContainer />
      <div className="card">
        <div className="card-header payoff-header">
          <h3 className="card-title">Strategy - {strategy}</h3>
          <div className="add-button">
            <ButtonGroup>
              <DropdownButton
                as={ButtonGroup}
                title="Add To"
                id="bg-nested-dropdown"
              >
                <Dropdown.Item
                  onClick={addToWatchlist}
                  className="add-button-item"
                  eventKey="1"
                >
                  Watchlist
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={addToPortfolio}
                  className="add-button-item"
                  eventKey="2"
                >
                  Portfolio
                </Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
          </div>
        </div>
        <div className="card-body">
          <div className="row g-3 pb-3 align-items-center">
            <div className="col-auto">
              <label htmlFor="symbols" className="search-label">
                Symbol
              </label>
            </div>
            <div className="col-md-3">
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
            <div className="col-md-3">
              <Select
                name="expiryDate"
                className="oc-search-select-expiry"
                value={{ value: expiryDate, label: expiryDate }}
                onChange={onExpiryChange}
                options={expiryOptions}
              />
            </div>
          </div>
          <PayoffTable />
        </div>
      </div>
    </>
  );
};

export default PayOffPage;
