import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

import InfoModal from "../../components/InfoModal";
import {
  deleteWatchlist,
  getWatchlist,
  watchlistReset,
} from "../../features/watchlist/watchlistSlice";
import { setPosition } from "../../features/strategyBuilder/strategyBuilderSlice";
import { formatValue } from "../../business/Utils";
import { resetAuth, logout } from "../../features/auth/authSlice";

const WatchlistItems = () => {
  //
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //
  let watchlist = useSelector((state) => state.watchlist.watchlist);
  let watchlistStatus = useSelector((state) => state.watchlist.watchlistStatus);
  let watchlistMessage = useSelector(
    (state) => state.watchlist.watchlistMessage
  );

  const funAnalyse = (positions) => {
    dispatch(setPosition(positions));
    navigate("/strategy-builder");
  };
  const funDelete = (id) => {
    dispatch(deleteWatchlist({ id }));
  };

  //Modal start
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  //Modal End

  useEffect(() => {
    if (watchlistStatus === "succeeded" && watchlistMessage) {
      toast.success(watchlistMessage);
      dispatch(getWatchlist());
    }

    if (watchlistStatus === "failed" && watchlistMessage) {
      if (watchlistMessage === "Unauthorized") {
        dispatch(logout());
        handleShow();
      } else {
        toast.error(watchlistMessage);
      }
    }
    return () => {
      dispatch(resetAuth());
      if (watchlistMessage) dispatch(watchlistReset());
    };
  }, [dispatch, watchlistStatus, watchlistMessage]);

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
      <Accordion>
        {watchlist?.map((watchListItem, index) => (
          <Accordion.Item key={index} eventKey={index}>
            <Accordion.Header>
              <div>
                {/* <span className="watchlist-lable">Symbol : </span> */}
                <span className="watchlist-title">
                  {watchListItem.underlying}
                </span>
                {/* <span className="watchlist-lable">Expiry : </span> */}
                <span className="watchlist-title">-</span>
                <span className="watchlist-date">
                  {watchListItem.expiryDate}
                </span>
                {/* <span className="watchlist-lable">Current Price :</span> */}
                {/* <span className="watchlist-price">16,750</span> */}
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="watchlist-item">
                <div className="table-responsive watchlist-table mb-2">
                  <Table striped hover size="sm">
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Expiry Date</th>
                        <th>Strike Price</th>
                        <th>Option Type</th>
                        <th>Trade Type</th>
                        <th>Quantity</th>
                        <th>Current Price</th>
                        <th>Price Change</th>
                        <th>Price Change %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchListItem.positions?.map((position, index) => (
                        <tr key={index}>
                          <td>{position.symbol}</td>
                          <td>{position.expiryDate}</td>
                          <td>{position.strikePrice}</td>
                          <td>{position.option}</td>
                          <td>{position.transaction}</td>
                          <td>{position.lotSize * position.contractSize}</td>
                          <td>{position.lastPrice}</td>
                          <td>
                            {position.priceChg > 0 ? (
                              <span className="text-green d-inline-flex align-items-center lh-1">
                                {position.priceChg}
                              </span>
                            ) : (
                              <span className="text-red d-inline-flex align-items-center lh-1">
                                {position.priceChg}
                              </span>
                            )}
                          </td>
                          <td>
                            {position.priceChgPct > 0 ? (
                              <span className="text-green d-inline-flex align-items-center lh-1">
                                {formatValue(
                                  position.priceChgPct,
                                  "percentage"
                                )}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon ms-1"
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <polyline points="3 17 9 11 13 15 21 7" />
                                  <polyline points="14 7 21 7 21 14" />
                                </svg>
                              </span>
                            ) : (
                              <span className="text-red d-inline-flex align-items-center lh-1">
                                {formatValue(
                                  position.priceChgPct,
                                  "percentage"
                                )}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon ms-1"
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <polyline points="3 7 9 13 13 9 21 17" />
                                  <polyline points="21 10 21 17 14 17" />
                                </svg>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="watchlist-actions">
                  <Button
                    onClick={() => funAnalyse(watchListItem.positions)}
                    className="watchlist-button"
                    variant="success"
                    size="sm"
                  >
                    Analyse
                  </Button>
                  <Button
                    onClick={() => funDelete(watchListItem.id)}
                    className="watchlist-button"
                    variant="danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
        {watchlist?.length <= 0 && (
          <span>
            Please use Strategy Builder or Built-in Strategies to add items in
            to your Watchlist
          </span>
        )}
      </Accordion>
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

export default WatchlistItems;
