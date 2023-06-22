import { useEffect } from "react";
import { useDispatch } from "react-redux";

import OptionChainSearch from "./optionChainSearch";
import OptionChainTable from "./optionChainTable";
import { setActiveMenu } from "../../features/settings/settingsSlice";

import "./style.scss";

const OptionChain = () => {
  //
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
                <h3 className="card-title">Option Chain</h3>
                <OptionChainSearch />
                <OptionChainTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OptionChain;
