import { useEffect } from "react";
import { useDispatch } from "react-redux";

import User from "./user";
import { getUser, accountReset } from "../../features/account/accountSlice";

const Account = () => {
  //
  const dispatch = useDispatch();
  //
  useEffect(() => {
    dispatch(getUser({}));
    //
    return () => {
      dispatch(accountReset());
    };
  }, [dispatch]);

  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Account</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <User />
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
