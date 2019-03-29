import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="container">
      <div className="row justify-content-between">
        <div className="col-6">
          <Link to="/voiceonly">
            <button type="button" className="btn btn-primary btn-lg btn-block">
              <h1>Voice only</h1>
            </button>
          </Link>
        </div>
        <div className="col-6">
          <Link to="/multimodal">
            <button type="button" className="btn btn-success btn-lg btn-block">
              <h1>Multimodal </h1>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
