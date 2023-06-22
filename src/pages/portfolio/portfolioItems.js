import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import InfoModal from "../../components/InfoModal";
import {
  deletePortfolio,
  getPortfolio,
  portfolioReset,
} from "../../features/portfolio/portfolioSlice";
import { setPosition } from "../../features/strategyBuilder/strategyBuilderSlice";
import { formatValue } from "../../business/Utils";
import { resetAuth, logout } from "../../features/auth/authSlice";

function getTotalPl(positions) {
  let pl = 0;
  if (positions && positions.length > 0) {
    for (let index = 0; index < positions.length; index++) {
      const element = positions[index];
      pl = pl + element?.pl;
    }
  }
  return pl;
}

const PortfolioItems = () => {
  //
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //
  let portfolio = useSelector((state) => state.portfolio.portfolio);
  let portfolioStatus = useSelector((state) => state.portfolio.portfolioStatus);
  let portfolioMessage = useSelector(
    (state) => state.portfolio.portfolioMessage
  );

  const funAnalyse = (positions) => {
    dispatch(setPosition(positions));
    navigate("/strategy-builder");
  };
  const funDelete = (id) => {
    dispatch(deletePortfolio({ id }));
  };

  //Modal start
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  //Modal End

  useEffect(() => {
    if (portfolioStatus === "succeeded" && portfolioMessage) {
      toast.success(portfolioMessage);
      dispatch(getPortfolio());
    }
    if (portfolioStatus === "failed" && portfolioMessage) {
      if (portfolioMessage === "Unauthorized") {
        dispatch(logout());
        handleShow();
      } else {
        toast.error(portfolioMessage);
      }
    }
    return () => {
      dispatch(resetAuth());
      if (portfolioMessage) dispatch(portfolioReset());
    };
  }, [dispatch, portfolioStatus, portfolioMessage]);

  return (
    <>
      <ToastContainer />
      <Accordion>
        {portfolio?.map((portfolioItem, index) => (
          <Accordion.Item key={index} eventKey={index}>
            <Accordion.Header>
              <div>
                {/* <span className="portfolio-lable">Symbol : </span> */}
                <span className="portfolio-title">
                  {portfolioItem.underlying}
                </span>
                {/* <span className="portfolio-lable">Expiry : </span> */}
                <span className="portfolio-title">-</span>
                <span className="portfolio-date">
                  {portfolioItem.expiryDate}
                </span>
                {/* <span className="portfolio-lable">Current Price :</span> */}
                {/* <span className="portfolio-price">16,750</span> */}
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="portfolio-item">
                <div className="table-responsive portfolio-table mb-2">
                  <Table striped hover size="sm">
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Expiry Date</th>
                        <th>Strike Price</th>
                        <th>Option Type</th>
                        <th>Trade Type</th>
                        <th>Quantity</th>
                        <th>Buy Price</th>
                        <th>Current Price</th>
                        <th>Profit/Loss</th>
                        <th>Profit/Loss %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioItem.positions?.map((position, index) => (
                        <tr key={index}>
                          <td>{position.symbol}</td>
                          <td>{position.expiryDate}</td>
                          <td>{position.strikePrice}</td>
                          <td>{position.option}</td>
                          <td>{position.transaction}</td>
                          <td>{position.lotSize * position.contractSize}</td>
                          <td>{position.premium}</td>
                          <td>{position.lastPrice}</td>
                          <td>
                            {position.pl > 0 ? (
                              <span className="text-green d-inline-flex align-items-center lh-1">
                                {position.pl}
                              </span>
                            ) : (
                              <span className="text-red d-inline-flex align-items-center lh-1">
                                {position.pl}
                              </span>
                            )}
                          </td>
                          <td>
                            {position.plPct > 0 ? (
                              <span className="text-green d-inline-flex align-items-center lh-1">
                                {formatValue(position.plPct, "percentage")}
                              </span>
                            ) : (
                              <span className="text-red d-inline-flex align-items-center lh-1">
                                {formatValue(position.plPct, "percentage")}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={6}></td>
                        <td colSpan={2}>Total Profit/Loss </td>
                        <td colSpan={1}>
                          {getTotalPl(portfolioItem.positions) > 0 ? (
                            <span className="text-green d-inline-flex align-items-center lh-1">
                              {formatValue(
                                getTotalPl(portfolioItem.positions),
                                "numeric"
                              )}
                            </span>
                          ) : (
                            <span className="text-red d-inline-flex align-items-center lh-1">
                              {formatValue(
                                getTotalPl(portfolioItem.positions),
                                "numeric"
                              )}
                            </span>
                          )}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <div className="portfolio-actions">
                  <Button
                    onClick={() => funAnalyse(portfolioItem.positions)}
                    className="portfolio-button"
                    variant="success"
                    size="sm"
                  >
                    Analyse
                  </Button>
                  <Button
                    onClick={() => funDelete(portfolioItem.id)}
                    className="portfolio-button"
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
        {portfolio?.length <= 0 && (
          <span>
            Please use Strategy Builder or Built-in Strategies to add items in
            to your Portfolio
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

export default PortfolioItems;
