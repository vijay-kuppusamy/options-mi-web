import { useEffect } from "react";
import { useDispatch } from "react-redux";

import OpenIterestSearch from "./openInterestSearch";
import OpenInterestChart from "./openInterestChart";
import OpenInterestChangeChart from "./openInterestChangeChart";
import { setActiveMenu } from "../../features/settings/settingsSlice";

import "./style.scss";

const OpenInterest = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveMenu("options"));
  }, [dispatch]);

  return (
    <>
      <div>
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Open Interest</h3>
                <OpenIterestSearch />
                <br />
                <OpenInterestChart />
                <OpenInterestChangeChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenInterest;
