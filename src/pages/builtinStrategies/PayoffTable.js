import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { IconPencil } from "@tabler/icons";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import PayoffChart from "./payoffChart";
import { getPayOff } from "../../business/StrategyBuilder";
import { getOptionByExpiryNStrike } from "../../business/OptionChain";
import { updatePosition } from "../../features/builtinStrategies/builtinStrategySlice";
import { formatNumValue } from "../../business/Utils";

const PayoffTable = () => {
  //
  const dispatch = useDispatch();
  //
  const optionData = useSelector((state) => state.optionChain.optionData);
  const spotPrice = useSelector((state) => state.optionChain.spotPrice);
  const expiryDates = useSelector((state) => state.optionChain.expiryDates);
  const strikePrices = useSelector((state) => state.optionChain.strikePrices);
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

  let positions = useSelector((state) => state.builtinStrategy.positions);

  const [values, setValues] = useState(null);

  //Modal start
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getLots = () => {
    let lots = [];
    for (let i = 1; i <= 100; i++) {
      const option = { value: i, label: i };
      lots.push(option);
    }
    return lots;
  };
  const lotOptions = getLots();

  const getSelectOptions = (list) => {
    let options = [];
    if (list != null && list.length > 0) {
      list.forEach((item) => {
        options.push({ value: item, label: item });
      });
    }
    return options;
  };

  const expiryOptions = getSelectOptions(expiryDates);
  const strikeOptions = getSelectOptions(strikePrices);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  let canSubmit = true;
  const validate = (values) => {
    const errors = {};

    if (!values.expiryDate) {
      errors.expiryDate = "Select Expiry";
    }
    if (!values.strikePrice) {
      errors.strike = "Select Strike";
    }
    if (!values.lotSize) {
      errors.lot = "Select Lot";
    }
    if (!values.premium) {
      errors.premium = "Enter Price";
    }
    if (
      isNaN(values.premium) ||
      values.premium === 0 ||
      values.premium === "0"
    ) {
      errors.premium = "Invalid Input";
    }

    if (Object.keys(errors).length > 0) {
      canSubmit = false;
    }
    return errors;
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setFormErrors({});
  };

  const setPremium = (expiry, strike) => {
    let data = getOptionByExpiryNStrike(optionData, expiry, strike);
    let price = 0;
    let vol = 0;
    if (formData.option === "Call") {
      price = data?.callLastPrice;
      vol = data?.callTradedVolume;
    }
    if (formData.option === "Put") {
      price = data?.putLastPrice;
      vol = data?.putTradedVolume;
    }
    setFormData((prevState) => ({
      ...prevState,
      premium: price,
      volume: vol,
    }));
  };

  const onStrikeChange = (selected) => {
    setFormData((prevState) => ({
      ...prevState,
      strikePrice: selected.value,
    }));
    setPremium(formData.expiryDate, selected.value);
    setFormErrors({});
  };
  const onLotChange = (selected) => {
    setFormData((prevState) => ({
      ...prevState,
      lotSize: selected.value,
    }));
    setFormErrors({});
  };

  const editPosition = (index) => {
    let position = positions[index];
    setFormErrors({});
    setFormData(position);
    handleShow();
  };

  const funUpdatePosition = () => {
    setFormErrors(validate(formData));
    if (canSubmit) {
      dispatch(updatePosition(formData));
      setFormData({});
      handleClose();
    }
  };
  //Modal End

  useEffect(() => {
    if (positions && positions.length > 0) {
      let data = getPayOff(positions, underlyingConfig);
      setValues(data);
    }
  }, [positions, underlyingConfig]);

  if (positions && positions.length > 0) {
    return (
      <>
        {/* Position Table Start */}
        <div>
          <div>
            <h3 className="card-title">
              Positions - Current Price : {formatNumValue(spotPrice, "numeric")}
            </h3>
          </div>
          <div className="table-responsive mb-3">
            <table className="table position-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Expiry</th>
                  <th>Strike</th>
                  <th>Option</th>
                  <th>Type</th>
                  <th>Lots</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, index) => (
                  <tr key={index}>
                    <td>{position.symbol}</td>
                    <td>{position.expiryDate}</td>
                    <td>{formatNumValue(position.strikePrice, "numeric")}</td>
                    <td>{position.option}</td>
                    <td>{position.transaction}</td>
                    <td>{position.lotSize}</td>
                    <td>{formatNumValue(position.premium, "price")}</td>
                    <td>
                      <Tooltip title="Edit Position">
                        <IconButton
                          onClick={() => editPosition(index)}
                          size="small"
                        >
                          <IconPencil />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Position Table End */}
        {/* Payoff Table Starts */}
        <div>
          <div>
            <h3 className="card-title">Payoff</h3>
          </div>
          <div className="table-responsive mb-3">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <b>Max profit</b>
                  </td>
                  <td>{formatNumValue(values?.maxProfit, "price")}</td>
                  <td>
                    <b>Max Loss</b>
                  </td>
                  <td>{formatNumValue(values?.maxLoss, "price")}</td>
                  <td>
                    <b>Risk / Reward</b>
                  </td>
                  <td>{formatNumValue(values?.riskRewardRatio, "fixed")}</td>
                </tr>
                <tr>
                  <td>
                    <b>Breakeven</b>
                  </td>
                  <td>
                    {Number(values?.breakEvenList[0])
                      ? new Intl.NumberFormat("en-IN").format(
                          values?.breakEvenList[0]
                        )
                      : values?.breakEvenList[0]}
                    {Number(values?.breakEvenList[1])
                      ? " - " +
                        new Intl.NumberFormat("en-IN").format(
                          values?.breakEvenList[1]
                        )
                      : values?.breakEvenList[1]}
                  </td>
                  <td>
                    <b>Prob. of Profit</b>
                  </td>
                  <td></td>
                  {/* <td>{formatNumValue(values?.probability, "percentage")}</td> */}
                  <td>
                    <b>Days Remaining</b>
                  </td>
                  <td>{values?.daysRemaining}</td>
                </tr>
                <tr>
                  <td>
                    <b>Net Credit</b>
                  </td>
                  <td>{formatNumValue(values?.credit, "price")}</td>
                  <td>
                    <b>Net Debit</b>
                  </td>
                  <td>{formatNumValue(values?.debit, "price")}</td>
                  <td>Net Credit/Debit</td>
                  <td>{formatNumValue(values?.netCreditDebit, "price")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Payoff Table ends */}
        {/* Payoff chart Starts */}
        <div>
          <div>
            <h3 className="card-title">Payoff Chart</h3>
          </div>
          <div>{values && <PayoffChart values={values} />}</div>
        </div>
        {/* Payoff chart End */}

        {/* Add Position Modal start */}
        <div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Position</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="formfield-error">{}</div>
              <div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Symbol</label>
                      <Select
                        name="symbol"
                        value={{
                          value: formData.symbol,
                          label: formData.symbol,
                        }}
                        options={symbolOptions}
                        isDisabled={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Expiry</label>
                      <Select
                        name="expiryDate"
                        value={{
                          value: formData.expiryDate,
                          label: formData.expiryDate,
                        }}
                        options={expiryOptions}
                        isDisabled={true}
                      />
                      <div className="formfield-error">
                        {formErrors.expiryDate}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Strike</label>
                      <Select
                        name="strikePrice"
                        value={{
                          value: formData.strikePrice,
                          label: formData.strikePrice,
                        }}
                        options={strikeOptions}
                        onChange={onStrikeChange}
                      />
                      <div className="formfield-error">
                        {formErrors.strikePrice}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2">
                    <div className="mb-3">
                      <label className="form-label">Lots</label>
                      <Select
                        name="lotSize"
                        value={{
                          value: formData.lotSize,
                          label: formData.lotSize,
                        }}
                        options={lotOptions}
                        onChange={onLotChange}
                      />
                      <div className="formfield-error">
                        {formErrors.lotSize}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="text"
                        name="premium"
                        value={formData.premium}
                        className="form-control"
                        placeholder="Price"
                        onChange={onChange}
                      />
                      <div className="formfield-error">
                        {formErrors.premium}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Option</label>
                      <div className="builder-selectgroup-label">
                        <label className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            name="optionType"
                            value="Call"
                            type="radio"
                            disabled={true}
                            checked={formData.option === "Call"}
                          />
                          <span className="form-check-label">Call</span>
                        </label>
                        <label className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            name="optionType"
                            value="Put"
                            type="radio"
                            disabled={true}
                            checked={formData.option === "Put"}
                          />
                          <span className="form-check-label">Put</span>
                        </label>
                      </div>
                      <div className="formfield-error">
                        {formErrors.optionType}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Transaction</label>
                      <div className="builder-selectgroup-label">
                        <label className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="transactionType"
                            value="Buy"
                            disabled={true}
                            checked={formData.transaction === "Buy"}
                          />
                          <span className="form-check-label">Buy</span>
                        </label>
                        <label className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="transactionType"
                            value="Sell"
                            disabled={true}
                            checked={formData.transaction === "Sell"}
                          />
                          <span className="form-check-label">Sell</span>
                        </label>
                      </div>
                      <div className="formfield-error">
                        {formErrors.transactionType}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn btn-light me-auto" onClick={handleClose}>
                Close
              </Button>
              <Button className="btn btn-success" onClick={handleClose}>
                Get Quote
              </Button>
              <Button className="btn btn-primary" onClick={funUpdatePosition}>
                Update Position
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        {/* Add Position Modal End */}
      </>
    );
  } else {
    return (
      <>
        <div>Loading</div>
      </>
    );
  }
};

export default PayoffTable;
