import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Oval } from "react-loader-spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
//
import SuccessModal from "../../components/SuccessModal";
import { resetAuth, resetPassword } from "../../features/auth/authSlice";
import Logo from "../../layout/Header/Logo";

const Reset = () => {
  //
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  const authStatus = useSelector((state) => state.auth.authStatus);
  const authMessage = useSelector((state) => state.auth.authMessage);
  //
  const initialValues = { email: "" };
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  let canSubmit = true;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setFormErrors({});
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email";
    } else if (values.email.length > 40) {
      errors.email = "Email should be less than 40 characters";
    }
    if (Object.keys(errors).length > 0) {
      canSubmit = false;
    }
    return errors;
  };

  const resetPass = (event) => {
    event.preventDefault();
    setFormErrors(validate(formData));
    if (canSubmit) {
      dispatch(resetPassword(formData));
    }
  };

  //Modal start
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const modalMsg =
    " Password reset email sent!. Please follow the email link to reset your password";
  //Modal End

  useEffect(() => {
    if (authStatus === "failed") {
      toast.error(authMessage);
    }
    if (authStatus === "succeeded") {
      handleShow();
      //navigate('/');
    }
    return () => {
      dispatch(resetAuth());
    };
  }, [authMessage, authStatus, dispatch, navigate]);

  return (
    <>
      {authStatus === "pending" && (
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
      <div className="page page-center">
        <div className="container-tight py-4">
          <div className="text-center mb-4">
            <Logo />
          </div>
          <form
            className="card card-md"
            action="."
            method="get"
            autoComplete="off"
          >
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Reset Password</h2>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  autoComplete="off"
                  onChange={onChange}
                />
                <div class="formfield-error">{formErrors.email}</div>
              </div>
              <div className="form-footer">
                <button onClick={resetPass} className="btn btn-primary w-100">
                  Reset Password
                </button>
              </div>
            </div>
          </form>
          <div className="text-center text-muted mt-3">
            Go to <Link to="/">Home</Link> | Go to{" "}
            <Link to="/login"> Login </Link>
          </div>
        </div>
      </div>
      {/* Success modal start */}
      {show && (
        <SuccessModal
          setShow={setShow}
          title="Password Reset"
          message={modalMsg}
        />
      )}
      {/* Success modal end */}
    </>
  );
};

export default Reset;
