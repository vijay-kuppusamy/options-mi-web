import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import {
  IconPencil,
  IconTrash,
  IconFile,
  IconPlus,
  IconDeviceFloppy,
  IconTrashX,
} from "@tabler/icons";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import {
  addPosition,
  updatePosition,
  deletePosition,
  resetStrategyBuilder,
  resetPosition,
  getStrategies,
  loadStrategy,
} from "../../features/strategyBuilder/strategyBuilderSlice";
import { getOptionByExpiryNStrike } from "../../business/OptionChain";
import { getOptionChain } from "../../features/optionChain/optionChainSlice";
import {
  saveStrategy,
  deleteStrategy,
} from "../../features/strategyBuilder/strategyBuilderSlice";

const Positions = () => {
  //
  const dispatch = useDispatch();
  //
  const optionData = useSelector((state) => state.optionChain.optionData);
  const symbol = useSelector((state) => state.optionChain.symbol);
  const expiry = useSelector((state) => state.optionChain.expiry);
  const spotPrice = useSelector((state) => state.optionChain.spotPrice);
  const expiryDates = useSelector((state) => state.optionChain.expiryDates);
  const strikePrices = useSelector((state) => state.optionChain.strikePrices);
  const underlyingConfig = useSelector(
    (state) => state.optionChain.underlyingConfig
  );
  //
  const symbols = useSelector((state) => state.settings.symbols);
  //
  const positions = useSelector((state) => state.strategyBuilder.positions);
  const strategy = useSelector((state) => state.strategyBuilder.strategy);
  const strategies = useSelector((state) => state.strategyBuilder.strategies);
  const strategyBuilderStatus = useSelector(
    (state) => state.strategyBuilder.strategyBuilderStatus
  );
  const strategyBuilderMessage = useSelector(
    (state) => state.strategyBuilder.strategyBuilderMessage
  );

  const getSelectOptions = (list) => {
    let options = [];
    if (list != null && list.length > 0) {
      list.forEach((item) => {
        options.push({ value: item, label: item });
      });
    }
    return options;
  };
  //
  const formValues = { symbol: symbol, expiry: expiry };
  const [fieldSymbol, setFieldSymbol] = useState(formValues.symbol);
  const [expiryDate, setExpiryDate] = useState(formValues.expiry);

  let isReadOnly = false;
  if (positions && positions?.length > 0) isReadOnly = true;

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

  const expiryOptions = getSelectOptions(expiryDates);

  const onSymbolChange = (selected) => {
    formValues.symbol = selected.value;
    setFieldSymbol(formValues.expiry);
    dispatch(getOptionChain({ symbol: formValues.symbol }));
  };

  const onExpiryChange = (selected) => {
    formValues.expiry = selected.value;
    setExpiryDate(selected.value);
    dispatch(getOptionChain(formValues));
  };

  const funSaveStrategy = (event) => {
    event.preventDefault();
    if (positions && positions.length > 0) {
      if (strategy && strategy.name) {
        dispatch(
          saveStrategy({
            positions,
            spotPrice,
            expiryDates,
            expiry,
            underlyingConfig,
            strategy,
            saveFormData,
          })
        );
      } else {
        handleSaveModalShow();
      }
    } else {
      toast.error("Please create a position");
    }
  };

  const funDeleteStrategy = (e) => {
    e.preventDefault();
    if (positions && positions.length > 0) {
      dispatch(deleteStrategy(strategy));
    } else {
      toast.error("Your are good, nothing to delete");
    }
  };

  // Modal Start
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const hasValue = positions && positions.length > 0 ? true : false;

  const createPosition = () => {
    let positionLength = 0;
    if (positions && positions?.length > 0) positionLength = positions.length;

    let position = {
      index: positionLength,
      symbol: symbol,
      volume: "",
      premium: "",
      expiryDate: expiry,
      strikePrice: "",
      spotPrice: spotPrice,
      option: "Call",
      transaction: "Buy",
      iv: "",
      lotSize: "",
      contractSize: underlyingConfig.lotSize,
    };
    return position;
  };

  const getLots = () => {
    let lots = [];
    for (let i = 1; i <= 100; i++) {
      const option = { value: i, label: i };
      lots.push(option);
    }
    return lots;
  };
  const lotOptions = getLots();
  const strikeOptions = getSelectOptions(strikePrices);

  let canSubmit = true;
  const validate = (values) => {
    const errors = {};
    if (!values.symbol) {
      errors.symbol = "Select Symbol";
    }
    if (!values.expiryDate) {
      errors.expiryDate = "Select Expiry";
    }
    if (!values.strikePrice) {
      errors.strikePrice = "Select Strike";
    }
    if (!values.lotSize) {
      errors.lotSize = "Select Lot";
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

    if (!values.option) {
      errors.option = "Select Option";
    }
    if (!values.transaction) {
      errors.transaction = "Select Option";
    }
    let isCreated = false;

    if (isEdit) {
      isCreated = isUpdatePositionCreated(values);
    } else {
      isCreated = isPositionCreated(values);
    }

    if (isCreated) {
      errors.position =
        "Position already created. Please try to modity the existing position";
    }

    if (Object.keys(errors).length > 0) {
      canSubmit = false;
    }
    return errors;
  };

  const isPositionCreated = (formData) => {
    let created = false;
    if (positions && positions.length > 0) {
      for (let i = 0; i < positions.length; i++) {
        const order = positions[i];
        //console.log(i, formData.index);
        if (
          order.symbol === formData.symbol &&
          order.expiryDate === formData.expiryDate &&
          order.strikePrice === formData.strikePrice &&
          order.option === formData.option &&
          order.transaction === formData.transaction
        ) {
          created = true;
          return created;
        }
      }
    }
    return created;
  };

  const isUpdatePositionCreated = (formData) => {
    let created = false;
    if (positions && positions.length > 0) {
      for (let i = 0; i < positions.length; i++) {
        const order = positions[i];
        //console.log(i, formData.index);
        if (
          i !== formData.index &&
          order.symbol === formData.symbol &&
          order.expiryDate === formData.expiryDate &&
          order.strikePrice === formData.strikePrice &&
          order.option === formData.option &&
          order.transaction === formData.transaction
        ) {
          created = true;
          return created;
        }
      }
    }
    return created;
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
    let volatility = 0;
    if (formData.option === "Call") {
      price = data?.callLastPrice;
      vol = data?.callTradedVolume;
      volatility = data?.callIV;
    }
    if (formData.option === "Put") {
      price = data?.putLastPrice;
      vol = data?.putTradedVolume;
      volatility = data?.putIV;
    }
    setFormData((prevState) => ({
      ...prevState,
      premium: price,
      volume: vol,
      iv: volatility,
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

  const onLotsChange = (selected) => {
    setFormData((prevState) => ({
      ...prevState,
      lotSize: selected.value,
    }));
    setFormErrors({});
  };

  const formateExpiry = (expiry) => {
    let formatedExpiry = "";
    try {
      const myArray = expiry.split("-");
      formatedExpiry = myArray[0] + "-" + myArray[1];
    } catch (e) {}
    return formatedExpiry;
  };

  const funNewStrategy = (e) => {
    e.preventDefault();
    dispatch(resetPosition());
  };

  const funNewPosition = (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsEdit(false);
    setFormData(createPosition());
    handleShow();
  };

  const funEditPosition = (index) => {
    const order = positions[index];
    setFormErrors({});
    setFormData(order);
    setIsEdit(true);
    handleShow();
  };

  const funDeletePosition = (index) => {
    dispatch(deletePosition({ index: index }));
  };

  const funAddPosition = () => {
    setFormErrors(validate(formData));
    if (canSubmit) {
      dispatch(addPosition(formData));
      handleClose();
    }
  };

  const funUpdatePosition = () => {
    setFormErrors(validate(formData));
    if (canSubmit) {
      dispatch(updatePosition(formData));
      setIsEdit(false);
      setFormData({});
      handleClose();
    }
  };
  // Modal End

  // Strategy Save Modal Start
  const [saveModalShow, setSaveModalShow] = useState(false);
  const handleSaveModalClose = () => setSaveModalShow(false);
  const handleSaveModalShow = () => setSaveModalShow(true);

  const initialValues = { name: "", notes: "" };
  const [saveFormData, setSaveFormData] = useState(initialValues);
  const [saveFormErrors, setSaveFormErrors] = useState({});

  const onSaveFormChange = (e) => {
    setSaveFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setSaveFormErrors({});
  };

  let canSaveFormSubmit = true;
  const saveFormvalidate = (values) => {
    const nameregex = /^[A-Za-z0-9._-\s]*$/;

    const errors = {};
    if (!values.name) {
      errors.name = "Please enter name";
    } else if (values.name.length > 32) {
      errors.email = "Name should be less than 32 characters";
    } else if (!nameregex.test(values.name)) {
      errors.email = "Name should only have alphanumeric and .-_ characters";
    }

    if (!values.notes) {
      errors.notes = "Please enter notes";
    } else if (values.notes.length > 200) {
      errors.email = "Notes should be less than 32 characters";
    } else if (!nameregex.test(values.notes)) {
      errors.email = "notes should only have alphanumeric and .-_ characters";
    }
    if (Object.keys(errors).length > 0) {
      canSaveFormSubmit = false;
    }
    return errors;
  };

  const funSaveStrategyModal = () => {
    setSaveFormErrors(saveFormvalidate(saveFormData));
    if (canSaveFormSubmit) {
      if (positions && positions.length > 0) {
        dispatch(
          saveStrategy({
            positions,
            spotPrice,
            expiryDates,
            expiry,
            underlyingConfig,
            strategies,
            saveFormData,
          })
        );
        handleSaveModalClose();
      }
    }
  };
  // Strategy Save Modal End

  useEffect(() => {
    //
    setFieldSymbol(formValues.symbol);
    setExpiryDate(formValues.expiry);

    if (strategy && strategy.name) {
      dispatch(
        loadStrategy({
          strategy,
          spotPrice,
          optionData,
          expiryDates,
          underlyingConfig,
        })
      );
    }

    if (strategyBuilderStatus === "failed") {
      if (strategyBuilderMessage !== "Unauthorized") {
        toast.error(strategyBuilderMessage);
      }
    }
    if (strategyBuilderStatus === "succeeded") {
      if (strategyBuilderMessage) {
        dispatch(resetPosition());
        dispatch(getStrategies());
        toast.success(strategyBuilderMessage);
      }
    }
    return () => {
      dispatch(resetStrategyBuilder());
    };
  }, [
    dispatch,
    strategyBuilderMessage,
    strategyBuilderStatus,
    formValues.symbol,
    formValues.expiry,
    expiryDates,
    optionData,
    spotPrice,
    strategy,
    underlyingConfig,
  ]);

  return (
    <>
      {strategyBuilderStatus === "pending" && (
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
      {/* Card Start */}
      <div className="card pb-3">
        {/* Header Start */}
        <div>
          <div className="row builder-header">
            <div className="builder-title">
              <h3>Strategy Builder </h3>
            </div>
            <div className="col-2 col-sm-2 col-md-2 builder-icon">
              <Tooltip title="New Strategy">
                <a
                  href="."
                  type="button"
                  onClick={funNewStrategy}
                  className="btn btn-green btn-icon"
                  aria-label="New Strategy"
                >
                  <IconFile />
                </a>
              </Tooltip>
            </div>
            <div className="col-2 col-sm-2 col-md-2 builder-icon">
              <Tooltip title="Save Strategy">
                <a
                  href="."
                  type="button"
                  onClick={funSaveStrategy}
                  className="btn btn-yellow btn-icon"
                  aria-label="Save Strategy"
                >
                  <IconDeviceFloppy />
                </a>
              </Tooltip>
            </div>
            <div className="col-2 col-sm-2 col-md-2 builder-icon">
              <Tooltip title="Delete Strategy">
                <a
                  href="."
                  type="button"
                  onClick={funDeleteStrategy}
                  className="btn btn-red btn-icon"
                  aria-label="Delete Strategy"
                >
                  <IconTrashX />
                </a>
              </Tooltip>
            </div>
          </div>
        </div>
        {/* Header End */}
        {/* Position Table Start */}
        <div className="strategy-name">
          <h3>Strategy : {strategy ? strategy.name : "New"}</h3>
          <div className="add-icon">
            <Tooltip title="Add Position">
              <a
                href="."
                type="button"
                onClick={funNewPosition}
                className="btn btn-blue btn-icon"
                aria-label="Add Position"
              >
                <IconPlus />
              </a>
            </Tooltip>{" "}
            <ButtonGroup className="add-button">
              <DropdownButton
                as={ButtonGroup}
                title="Add To"
                id="bg-nested-dropdown"
              >
                <Dropdown.Item className="add-button-item" eventKey="1">
                  Watchlist
                </Dropdown.Item>
                <Dropdown.Item className="add-button-item" eventKey="2">
                  Portfolio
                </Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
          </div>
        </div>
        <div className="row strategy-form">
          <div className="col-auto">
            <label htmlFor="symbols" className="search-label">
              Symbol
            </label>
          </div>
          <div className="col-md-4">
            <Select
              name="symbol"
              className="oc-search-select-symbol"
              value={{ value: fieldSymbol, label: fieldSymbol }}
              options={symbolOptions}
              onChange={onSymbolChange}
              isDisabled={isReadOnly}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="expiryDate" className="search-label">
              Expiry Date
            </label>
          </div>
          <div className="col-md-4">
            <Select
              name="expiryDate"
              className="oc-search-select-expiry"
              value={{ value: expiryDate, label: expiryDate }}
              onChange={onExpiryChange}
              options={expiryOptions}
              isDisabled={isReadOnly}
            />
          </div>
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
              {hasValue &&
                positions.map((order, index) => (
                  <tr key={index}>
                    <td>{order.symbol}</td>
                    <td>{formateExpiry(order.expiryDate)}</td>
                    <td>{order.strikePrice}</td>
                    <td>{order.option}</td>
                    <td>{order.transaction}</td>
                    <td>{order.lotSize}</td>
                    <td>{order.premium}</td>

                    <td>
                      <Tooltip title="Edit Position">
                        <IconButton
                          onClick={() => funEditPosition(index)}
                          size="small"
                        >
                          <IconPencil />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Position">
                        <IconButton
                          onClick={() => funDeletePosition(index)}
                          size="small"
                        >
                          <IconTrash />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* Position Table End */}
      </div>
      {/* Card End */}

      {/* Add Position Modal start */}
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEdit ? "Edit Position" : "Add Position"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="formfield-error">{formErrors.position}</div>
            <div>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Symbol</label>
                    <input
                      type="text"
                      value={formData.symbol}
                      className="form-control"
                      readOnly={true}
                      disabled={true}
                      placeholder="Symbol"
                    />
                    <div className="formfield-error">{formErrors.symbol}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Expiry</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      className="form-control"
                      readOnly={true}
                      disabled={true}
                      placeholder="Expiry"
                    />
                    <div className="formfield-error">{formErrors.expiry}</div>
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
                      onChange={onStrikeChange}
                      options={strikeOptions}
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
                      onChange={onLotsChange}
                      options={lotOptions}
                    />
                    <div className="formfield-error">{formErrors.lotSize}</div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="text"
                      name="premium"
                      value={formData.premium}
                      onChange={onChange}
                      className="form-control"
                      placeholder="Price"
                    />
                    <div className="formfield-error">{formErrors.premium}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Option</label>
                    <div className="builder-selectgroup-label">
                      <label className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          name="option"
                          value="Call"
                          type="radio"
                          onChange={onChange}
                          checked={formData.option === "Call"}
                        />
                        <span className="form-check-label">Call</span>
                      </label>
                      <label className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          name="option"
                          value="Put"
                          type="radio"
                          onChange={onChange}
                          checked={formData.option === "Put"}
                        />
                        <span className="form-check-label">Put</span>
                      </label>
                    </div>
                    <div className="formfield-error">{formErrors.option}</div>
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
                          name="transaction"
                          value="Buy"
                          onChange={onChange}
                          checked={formData.transaction === "Buy"}
                        />
                        <span className="form-check-label">Buy</span>
                      </label>
                      <label className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="transaction"
                          value="Sell"
                          onChange={onChange}
                          checked={formData.transaction === "Sell"}
                        />
                        <span className="form-check-label">Sell</span>
                      </label>
                    </div>
                    <div className="formfield-error">
                      {formErrors.transaction}
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

            {isEdit ? (
              <Button className="btn btn-primary" onClick={funUpdatePosition}>
                Update Position
              </Button>
            ) : (
              <Button className="btn btn-primary" onClick={funAddPosition}>
                Add Position
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
      {/* Add Position Modal End */}

      {/* Save Strategy Modal start */}
      <div>
        <Modal show={saveModalShow} onHide={handleSaveModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Save Strategy</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="col">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={saveFormData.name}
                  onChange={onSaveFormChange}
                  placeholder="Name"
                  className="form-control"
                />
                <div className="formfield-error">{saveFormErrors.name}</div>
              </div>
              <br />
              <div className="col">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={saveFormData.notes}
                  onChange={onSaveFormChange}
                  placeholder="Notes"
                  className="form-control"
                ></textarea>
              </div>
              <div className="formfield-error">{saveFormErrors.notes}</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-light me-auto"
              onClick={handleSaveModalClose}
            >
              Close
            </Button>
            <Button className="btn btn-primary" onClick={funSaveStrategyModal}>
              Save Strategy
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* Save Strategy Modal End */}
    </>
  );
};

export default Positions;
