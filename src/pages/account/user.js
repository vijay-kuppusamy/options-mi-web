import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { accountReset, saveUser } from "../../features/account/accountSlice";
import { logout } from "../../features/auth/authSlice";
import ErrorModal from "../../components/ErrorModal";

const User = () => {
  //
  const dispatch = useDispatch();

  let user = useSelector((state) => state.account.user);
  let accountStatus = useSelector((state) => state.account.accountStatus);
  let accountMessage = useSelector((state) => state.account.accountMessage);

  const [name, setName] = useState(user?.name ? user?.name : "");
  const [email, setEmail] = useState(user?.email);
  const [mobile, setMobile] = useState(user?.mobile ? user?.mobile : "");

  const [formErrors, setFormErrors] = useState({});
  const [edit, setEdit] = useState(false);

  let canSubmit = true;

  const funcMakeEditable = () => {
    setEdit(true);
  };

  const funcCancel = () => {
    setEdit(false);
    setFormErrors({});
    setName(user?.name ? user?.name : "");
    setMobile(user?.mobile ? user?.mobile : "");
  };

  const validate = () => {
    const errors = {};
    const nameregex = /^[A-Za-z0-9._-\s]*$/;
    const phonenoregex = /^\d{10}$/;
    if (mobile && !phonenoregex.test(mobile)) {
      errors.mobile = "Invalid Mobile number";
    }
    if (name && !nameregex.test(name)) {
      errors.name = "Invalid name";
    }
    if (name && name.length > 32) {
      errors.name = "Name can not be more than 32 character";
    }
    if (Object.keys(errors).length > 0) {
      canSubmit = false;
    }
    return errors;
  };

  const funcSave = (event) => {
    event.preventDefault();
    setFormErrors(validate());
    let request = {
      name: name ? name : null,
      email,
      mobile: mobile ? mobile : null,
    };
    if (canSubmit) {
      dispatch(saveUser(request));
    }
  };

  const onChangeName = (e) => {
    setName(e.target.value);
    setFormErrors({});
  };
  const onChangeMobile = (e) => {
    setMobile(e.target.value);
    setFormErrors({});
  };
  //Modal start
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  //Modal End

  useEffect(() => {
    if (!name && user?.name) setName(user.name);
    if (!email && user?.email) setEmail(user.email);
    if (!mobile && user?.mobile) setMobile(user.mobile);

    if (accountStatus === "failed" && accountMessage === "Unauthorized") {
      dispatch(logout());
      handleShow();
    }

    if (accountStatus === "succeeded" && accountMessage === "Updated") {
      toast.success("User information updated");
      setEdit(false);
    }

    return () => {
      if (accountMessage) dispatch(accountReset());
    };
  }, [dispatch, accountStatus, accountMessage]);

  return (
    <>
      {accountStatus === "pending" && (
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
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">User Information</h3>
        </div>
        <div className="card-body">
          <Row>
            <Form.Label column lg={1}>
              Name :
            </Form.Label>
            <Col xs={5}>
              <input
                type="text"
                name="name"
                value={name}
                className="form-control mb-2"
                placeholder="Name"
                onChange={onChangeName}
                readOnly={edit ? false : true}
              />
            </Col>
            <div className="formfield-error">{formErrors.name}</div>
          </Row>
          <Row>
            <Form.Label column lg={1}>
              Email :
            </Form.Label>
            <Col xs={5}>
              <input
                type="text"
                name="email"
                value={email}
                className="form-control mb-2"
                placeholder="Email"
                disabled={true}
              />
            </Col>
          </Row>
          <Row>
            <Form.Label column lg={1}>
              Mobile :
            </Form.Label>
            <Col xs={5}>
              <input
                type="text"
                name="mobile"
                value={mobile}
                className="form-control mb-2"
                placeholder="Mobile"
                onChange={onChangeMobile}
                readOnly={edit ? false : true}
              />
            </Col>
            <div className="formfield-error">{formErrors.mobile}</div>
          </Row>
          <br />
          <div>
            {!edit && (
              <Button variant="primary" onClick={funcMakeEditable}>
                Edit
              </Button>
            )}{" "}
            {edit && (
              <Button variant="secondary" onClick={funcCancel}>
                Cancel
              </Button>
            )}{" "}
            {edit && (
              <Button variant="success" onClick={funcSave}>
                Save
              </Button>
            )}{" "}
          </div>
        </div>
      </div>
      {/* Error modal start */}
      {show && (
        <ErrorModal
          setShow={setShow}
          title="Error"
          message="Please login to continue."
        />
      )}
      {/* Error modal end */}
    </>
  );
};

export default User;
