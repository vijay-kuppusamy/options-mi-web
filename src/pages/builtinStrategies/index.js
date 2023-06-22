import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getOptionChain } from "../../features/optionChain/optionChainSlice";
import { setActiveMenu } from "../../features/settings/settingsSlice";
import { authenticate } from "../../features/auth/authSlice";
import { daysRemaining, getExpiryDate } from "../../business/Utils";

import Strategies from "./Strategies";
import PayOffPage from "./PayOffPage";

import "./style.scss";

const BuiltinStrategies = () => {
  //
  const dispatch = useDispatch();

  const symbol = useSelector((state) => state.optionChain.symbol);
  const expiry = useSelector((state) => state.optionChain.expiry);
  const expiryDates = useSelector((state) => state.optionChain.expiryDates);

  useEffect(() => {
    dispatch(setActiveMenu("trade"));
    dispatch(authenticate());

    // Loading Option Chain
    let days = daysRemaining(expiry);
    let expiryDate = "";
    let makeCall = false;
    if (days >= 1) {
      expiryDate = expiry;
    } else {
      makeCall = true;
      expiryDate = getExpiryDate(expiryDates);
    }
    if (makeCall) {
      dispatch(getOptionChain({ symbol, expiry: expiryDate }));
    }
  }, [dispatch, expiryDates, symbol, expiry]);

  return (
    <>
      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-xl">
            <div className="row row-deck row-cards">
              <div className="col-sm-12 col-md-3 col-lg-3">
                <Strategies />
              </div>
              <div className="col-sm-12 col-md-9 col-lg-9">
                <PayOffPage />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuiltinStrategies;
