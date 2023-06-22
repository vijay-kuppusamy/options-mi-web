import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="footer footer-transparent d-print-none">
        <div className="container-xl">
          <div className="row text-center align-items-center flex-row-reverse">
            <div className="col-lg-auto ms-lg-auto">
              <ul className="list-inline list-inline-dots mb-0">
                <li className="list-inline-item">
                  <a href="." className="link-secondary">
                    About Us
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="." className="link-secondary">
                    Contact Us
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="." className="link-secondary">
                    FAQ
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="." className="link-secondary">
                    Help
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-12 col-lg-auto mt-3 mt-lg-0">
              <ul className="list-inline list-inline-dots mb-0">
                <li className="list-inline-item">
                  Copyright © {new Date().getFullYear()} <span> </span>
                  <a href="." className="link-secondary">
                    Options Mi
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
