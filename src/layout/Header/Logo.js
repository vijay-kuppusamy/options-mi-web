import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/images/logo.png";

const Logo = () => {
  return (
    <>
      <Link
        to="/"
        className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3"
      >
        <img src={logoImg} className="logo" alt="options mi" />
        <span className="optionsmi-o">O</span>
        <span className="optionsmi">ptions</span>
        <span className="optionsmi-m">m</span>
        <span className="optionsmi-i">i</span>
      </Link>
    </>
  );
};

export default Logo;
