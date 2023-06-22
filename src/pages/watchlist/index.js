import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  getWatchlist,
  watchlistReset,
} from "../../features/watchlist/watchlistSlice";
import { setActiveMenu } from "../../features/settings/settingsSlice";
import WatchlistItems from "./watchListItems";

import "./style.scss";

const Watchlist = () => {
  //
  const dispatch = useDispatch();
  //
  useEffect(() => {
    dispatch(setActiveMenu("watchlist"));
    dispatch(getWatchlist());
    const intervalCall = setInterval(() => {
      //console.log("Getting Watch List");
      dispatch(getWatchlist());
    }, 60000);
    //
    return () => {
      dispatch(watchlistReset());
      clearInterval(intervalCall);
    };
  }, [dispatch]);

  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Watchlist</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <WatchlistItems />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Watchlist;
