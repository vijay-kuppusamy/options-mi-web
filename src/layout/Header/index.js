import React, { useState } from "react";
import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Oval } from "react-loader-spinner";
//
import Logo from "./Logo";
import { resetAuth, getUser, logout } from "../../features/auth/authSlice";
import {
  resetSettings,
  getSymbols,
} from "../../features/settings/settingsSlice";
import { getOptionChain } from "../../features/optionChain/optionChainSlice";

import {
  IconHome,
  IconBriefcase,
  IconClipboardList,
  IconCurrencyRupee,
  IconTimeline,
  IconChartBar,
  IconTable,
  IconUser,
  IconChartLine,
  // IconSun,
  // IconMoon,
  // IconBell,
  // IconStar,
  // IconToggleLeft,
  // IconToggleRight,
  // IconDeviceAnalytics,
  IconBallpen,
  IconBooks,
  IconTriangle,
} from "@tabler/icons";

const Header = () => {
  //
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  //const [menu, setMenu] = useState("home");
  //
  let user = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.authStatus);

  const menu = useSelector((state) => state.settings.menu);
  const settingsStatus = useSelector((state) => state.settings.settingsStatus);

  let symbol = useSelector((state) => state.optionChain.symbol);
  let expiry = useSelector((state) => state.optionChain.expiry);

  const [email, setEmail] = useState(user?.email);
  let optionChainStatus = useSelector(
    (state) => state.optionChain.optionChainStatus
  );

  //
  const funLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  const funLogin = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  const funAccount = (event) => {
    event.preventDefault();
    navigate("/account");
  };

  function activeLink(active) {
    //
    if (menu === active) {
      return "nav-item active";
    } else {
      return "nav-item";
    }
  }

  function activeLinkDropdown(active) {
    //
    if (menu === active) {
      return "nav-item dropdown active";
    } else {
      return "nav-item dropdown";
    }
  }

  useEffect(() => {
    setEmail(user?.email);
    dispatch(getSymbols());
    dispatch(getUser());
    dispatch(getOptionChain({ symbol: symbol, expiry: expiry }));
    const intervalCall = setInterval(() => {
      //console.log("Getting option Chain");
      dispatch(getOptionChain({ symbol: symbol, expiry: expiry }));
    }, 60000);
    return () => {
      dispatch(resetAuth());
      dispatch(resetSettings());
      clearInterval(intervalCall);
    };
  }, [dispatch, symbol, expiry, user?.email]);

  return (
    <>
      {(authStatus === "pending" ||
        settingsStatus === "pending" ||
        optionChainStatus === "pending") && (
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
      <div className="sticky-top">
        <header className="navbar navbar-expand-md navbar-light sticky-top d-print-none">
          <div className="container-xl">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbar-menu"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <Logo />
            <div className="navbar-nav flex-row order-md-last">
              {/* 
              <div className="d-none d-md-flex">
                <div className="nav-item dropdown d-none d-md-flex me-3">
                  <a
                    href="."
                    className="nav-link px-0"
                    data-bs-toggle="dropdown"
                    tabIndex={-1}
                    aria-label="Show notifications"
                  >
                    <IconBell />
                    <span className="badge bg-red" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Last updates</h3>
                      </div>
                      <div className="list-group list-group-flush list-group-hoverable">
                        <div className="list-group-item">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <span className="status-dot status-dot-animated bg-red d-block" />
                            </div>
                            <div className="col text-truncate">
                              <a href="." className="text-body d-block">
                                Example 1
                              </a>
                              <div className="d-block text-muted text-truncate mt-n1">
                                Change deprecated html tags to text decoration
                                classes (#29604)
                              </div>
                            </div>
                            <div className="col-auto">
                              <a href="." className="list-group-item-actions">
                                <IconStar />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> 
              */}
              <div className="nav-item dropdown">
                <a
                  href="."
                  className="nav-link d-flex lh-1 text-reset p-0"
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <span className="avatar avatar-sm">
                    {" "}
                    <IconUser />{" "}
                  </span>
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  {/* 
                  <a
                    href="?theme=dark"
                    className="nav-link px-0 hide-theme-dark"
                    title="Enable dark mode"
                    data-bs-toggle="tooltip"
                  >
                    <div className="toggle">
                      <IconSun /> <IconToggleLeft /> <IconMoon />
                    </div>
                  </a>
                  <a
                    href="?theme=light"
                    className="nav-link px-0 hide-theme-light"
                    title="Enable light mode"
                    data-bs-toggle="tooltip"
                  >
                    <div className="toggle">
                      <IconSun /> <IconToggleRight /> <IconMoon />
                    </div>
                  </a>
                  <div className="dropdown-divider" /> 
                  */}
                  {email && (
                    <span className="dropdown-item">Hello {user?.email}</span>
                  )}
                  {email && (
                    <span className="dropdown-item" onClick={funAccount}>
                      Account
                    </span>
                  )}
                  {/* <div className="dropdown-divider" /> */}
                  {email ? (
                    <span className="dropdown-item" onClick={funLogout}>
                      Logout
                    </span>
                  ) : (
                    <span className="dropdown-item" onClick={funLogin}>
                      Login
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="collapse navbar-collapse" id="navbar-menu">
              <div className="d-flex flex-column flex-md-row flex-fill justify-content-end">
                <ul className="navbar-nav">
                  <li className={activeLink("home")}>
                    <NavLink className="nav-link" to="/">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <IconHome />
                      </span>
                      <span className="nav-link-title">Home</span>
                    </NavLink>
                  </li>

                  <li className={activeLinkDropdown("options")}>
                    <NavLink
                      className="nav-link dropdown-toggle"
                      to="/options/*"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="true"
                      role="button"
                      aria-expanded="false"
                    >
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <IconTimeline />
                      </span>
                      <span className="nav-link-title">Options</span>
                    </NavLink>
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to="/option-chain">
                        <IconTable className="icon icon-inline me-1" />
                        Option Chain
                      </Link>
                      <Link className="dropdown-item" to="/option-greeks">
                        <IconTriangle className="icon icon-inline me-1" />
                        Option Greeks
                      </Link>
                      <Link className="dropdown-item" to="/open-interest">
                        <IconChartBar className="icon icon-inline me-1" />
                        Open Interest
                      </Link>
                      <Link className="dropdown-item" to="/historical-data">
                        <IconChartLine className="icon icon-inline me-1" />
                        Historical Data
                      </Link>
                    </div>
                  </li>
                  <li className={activeLinkDropdown("trade")}>
                    <NavLink
                      className="nav-link dropdown-toggle"
                      to="/trade/*"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="true"
                      role="button"
                      aria-expanded="false"
                    >
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <IconCurrencyRupee />
                      </span>
                      <span className="nav-link-title">Trade</span>
                    </NavLink>
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to="/builtin-strategies">
                        <IconBooks className="icon icon-inline me-1" />
                        Built-in Strategies
                      </Link>
                      <Link className="dropdown-item" to="/strategy-builder">
                        <IconBallpen className="icon icon-inline me-1" />
                        Strategy Builder
                      </Link>
                    </div>
                  </li>
                  <li className={activeLink("watchlist")}>
                    <NavLink className="nav-link" to="/watchlist">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <IconClipboardList />
                      </span>
                      <span className="nav-link-title">Watchlist</span>
                    </NavLink>
                  </li>
                  <li className={activeLink("portfolio")}>
                    <NavLink className="nav-link" to="/portfolio">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <IconBriefcase />
                      </span>
                      <span className="nav-link-title">Portfolio</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
