import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Positions from "./positions";
import MyStrategies from "./myStrategies";
import { getStrategies } from "../../features/strategyBuilder/strategyBuilderSlice";
import { resetAuth, logout } from "../../features/auth/authSlice";

import InfoModal from "../../components/InfoModal";

const Strategy = () => {
  //
  const dispatch = useDispatch();
  //
  const authStatus = useSelector((state) => state.auth.authStatus);
  const authMessage = useSelector((state) => state.auth.authMessage);

  //Modal start
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  //Modal End

  useEffect(() => {
    if (authStatus === "failed" && authMessage) {
      if (authMessage === "Unauthorized") {
        dispatch(logout());
        handleShow();
      }
    }
    dispatch(getStrategies());
    return () => {
      if (authMessage) dispatch(resetAuth());
    };
  }, [dispatch, authMessage, authStatus]);

  return (
    <>
      <div className="strategy">
        <div>
          <Positions />
        </div>
        <div>
          <MyStrategies />
        </div>
      </div>
      {/* Info modal start */}
      {show && (
        <InfoModal
          setShow={setShow}
          title="Login"
          message="Please login to continue."
        />
      )}
      {/* Info modal end */}
    </>
  );
};

export default Strategy;
