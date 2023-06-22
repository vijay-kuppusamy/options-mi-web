import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { IconBrandGoogle, IconEye, IconEyeOff } from "@tabler/icons";
import { Oval } from "react-loader-spinner";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

//
import { auth } from "../../auth/firebase";
import {
  login,
  loginWithGoogle,
  resetAuth,
} from "../../features/auth/authSlice";
import Logo from "../../layout/Header/Logo";

const Login = () => {
  //
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const provider = new GoogleAuthProvider();
  //
  let user = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.authStatus);
  const authMessage = useSelector((state) => state.auth.authMessage);
  //
  const initialValues = { email: "", password: "", showPassword: false };
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

  const funShowPassword = (event) => {
    event.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      showPassword: !formData.showPassword,
    }));
  };

  const funResetPassword = (event) => {
    event.preventDefault();
    navigate("/reset");
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
    if (!values.password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      canSubmit = false;
    }
    return errors;
  };

  const signinUser = (event) => {
    event.preventDefault();
    setFormErrors(validate(formData));
    if (canSubmit) {
      dispatch(login(formData));
    }
  };

  const getUserInfo = (response) => {
    let user = { name: "", email: "", mobile: "" };
    if (response) {
      user.name = response.displayName;
      user.email = response.email;
      user.mobile = response.phoneNumber;
    }
    return user;
  };

  const signinUserWithGoogle = (event) => {
    event.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        let user = getUserInfo(result.user);
        dispatch(loginWithGoogle(user));
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    if (authStatus === "failed") {
      toast.error(authMessage);
    }
    if (authStatus === "succeeded") {
      navigate("/");
    }
    return () => {
      dispatch(resetAuth());
    };
  }, [authStatus, authMessage, user, dispatch, navigate]);

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
              <h2 className="card-title text-center mb-4">
                Login to your account
              </h2>
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
                <div className="formfield-error">{formErrors.email}</div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Password
                  <span className="form-label-description">
                    <a href="." onClick={funResetPassword}>
                      I forgot password
                    </a>
                  </span>
                </label>
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
              {/* <div className="mb-2">
                <label className="form-check">
                  <input type="checkbox" className="form-check-input" />
                  <span className="form-check-label">Remember me on this device</span>
                </label>
              </div> */}
              <div className="form-footer">
                <button onClick={signinUser} className="btn btn-primary w-100">
                  Login
                </button>
              </div>
            </div>
            <div className="hr-text">or</div>
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <a
                    href="."
                    onClick={signinUserWithGoogle}
                    className="btn btn-google w-100"
                  >
                    <IconBrandGoogle />
                    Login with Google
                  </a>
                </div>
              </div>
            </div>
          </form>
          <div className="text-center text-muted mt-3">
            Go to <Link to="/">Home</Link> | Don't have account yet?{" "}
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
