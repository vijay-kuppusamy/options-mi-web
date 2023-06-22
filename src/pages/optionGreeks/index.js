import { useEffect } from "react";
import { useDispatch } from "react-redux";

import OptionGreeksSearch from "./optionGreeksSearch";
import OptionGreeksTable from "./optionGreeksTable";
import { setActiveMenu } from "../../features/settings/settingsSlice";

import "./style.scss";

const OptionsGreeks = () => {
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
                <h3 className="card-title">Option Greeks</h3>
                <OptionGreeksSearch />
                <br />
                <OptionGreeksTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OptionsGreeks;
