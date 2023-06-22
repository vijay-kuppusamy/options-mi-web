//
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//
import { IconEye, IconEyeOff } from "@tabler/icons";
import { Oval } from "react-loader-spinner";
//
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import SuccessModal from "../../components/SuccessModal";
import { register, resetAuth } from "../../features/auth/authSlice";
import Logo from "../../layout/Header/Logo";

const Register = () => {
  //
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  const authStatus = useSelector((state) => state.auth.authStatus);
  const authMessage = useSelector((state) => state.auth.authMessage);
  //
  const initialValues = {
    name: "",
    mobile: "",
    email: "",
    password: "",
    cpassword: "",
    agreed: false,
    showPassword: false,
  };
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

  const onChangeAgree = (e) => {
    //console.log(formData.agreed);
    setFormData((prevState) => ({
      ...prevState,
      agreed: !formData.agreed,
    }));
    setFormErrors({});
  };

  const funShowPassword = (event) => {
    event.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      showPassword: !formData.showPassword,
    }));
  };

  const validate = (values) => {
    const errors = {};

    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
    const phonenoregex = /^\d{10}$/;
    const nameregex = /^[A-Za-z0-9._-\s]*$/;

    if (values.mobile && !phonenoregex.test(values.mobile)) {
      errors.mobile = "Invalid Mobile number";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!emailregex.test(values.email)) {
      errors.email = "Invalid email";
    } else if (values.email.length > 40) {
      errors.email = "Email should be less than 40 characters";
    }

    if (values.name.length > 32) {
      errors.email = "Name should be less than 32 characters";
    } else if (!nameregex.test(values.name)) {
      errors.email = "Name should only have alphanumeric and .-_ characters";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (!passregex.test(values.password)) {
      errors.password =
        "Password must be between 6 and 12 characters and must contain at least one numeric digit, one uppercase and one lowercase letter";
    }
    if (!values.cpassword || values.cpassword !== values.password) {
      errors.cpassword = "Password and Confirm Password do not match";
    }
    if (!values.agreed) {
      errors.agreed = "Please agree to the terms and policy";
    }

    if (Object.keys(errors).length > 0) {
      canSubmit = false;
    }
    return errors;
  };

  const registerUser = async (event) => {
    event.preventDefault();
    setFormErrors(validate(formData));
    if (canSubmit) {
      dispatch(register(formData));
    }
  };

  //Modal start
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const modalMsg =
    "Account registered and verification email has been sent. Please check your email and verify before login.";
  //Modal End

  useEffect(() => {
    if (authStatus === "failed") {
      toast.error(authMessage);
    }
    if (authStatus === "succeeded") {
      // show modal
      handleShow();
      //navigate('/');
    }
    return () => {
      dispatch(resetAuth());
    };
  }, [authStatus, authMessage, dispatch, navigate]);

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
          <form className="card card-md">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                Create new account
              </h2>
              <h4 className="text-center">We hate spam and we don't spam! </h4>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter Name"
                  onChange={onChange}
                />
                <div className="formfield-error">{formErrors.name}</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  className="form-control"
                  placeholder="Enter Mobile Number"
                  onChange={onChange}
                />
                <div className="formfield-error">{formErrors.mobile}</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Email address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={onChange}
                />
                <div className="formfield-error">{formErrors.email}</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Password *</label>
                <div className="input-group input-group-flat">
                  <input
                    type={formData.showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    autoComplete="off"
                    onChange={onChange}
                  />
                  <span className="input-group-text">
                    <a
                      href="."
                      className="link-secondary"
                      title="Show password"
                      data-bs-toggle="tooltip"
                      onClick={funShowPassword}
                    >
                      {formData.showPassword ? <IconEyeOff /> : <IconEye />}
                    </a>
                  </span>
                  <div className="formfield-error">{formErrors.password}</div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password *</label>
                <div className="input-group input-group-flat">
                  <input
                    type={formData.showPassword ? "text" : "password"}
                    name="cpassword"
                    className="form-control"
                    placeholder="Password"
                    autoComplete="off"
                    onChange={onChange}
                  />
                  <span className="input-group-text">
                    <a
                      href="."
                      className="link-secondary"
                      title="Show password"
                      data-bs-toggle="tooltip"
                      onClick={funShowPassword}
                    >
                      {formData.showPassword ? <IconEyeOff /> : <IconEye />}
                    </a>
                  </span>
                  <div className="formfield-error">{formErrors.cpassword}</div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-check">
                  <input
                    type="checkbox"
                    name="agreed"
                    value="yes"
                    checked={formData.agreed}
                    onChange={onChangeAgree}
                    className="form-check-input"
                  />
                  <span className="form-check-label">
                    Agree the{" "}
                    <a href="./terms-of-service.html" tabIndex={-1}>
                      terms and policy
                    </a>
                    .
                  </span>
                </label>
                <div className="formfield-error">{formErrors.agreed}</div>
              </div>
              <div className="form-footer">
                <button
                  onClick={registerUser}
                  className="btn btn-primary w-100"
                >
                  Create new account
                </button>
              </div>
            </div>
          </form>
          <div className="text-center text-muted mt-3">
            Go to <Link to="/">Home</Link> | Already have account?{" "}
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
      {/* Success modal start */}
      {show && (
        <SuccessModal
          setShow={setShow}
          title="Account Created"
          message={modalMsg}
        />
      )}
      {/* Success modal end */}
    </>
  );
};

export default Register;
