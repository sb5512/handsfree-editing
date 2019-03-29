import React from "react";
import { Link } from "react-router-dom";

const Multimodal = props => {
  return (
    <div className="container">
      <button className="btn btn-light btn-lg float-right text-center">
        <i className="fa fa-microphone" />
        <br />
        <i className="fa fa-eye" />
      </button>

      <div className="row justify-content-between">
        <div className="col-4">
          <Link to="/dashboard">
            <button type="button" className="btn btn-success btn-lg btn-block">
              <h2>Copy Task</h2>
              <br />
              <br />
            </button>
          </Link>
        </div>
        <div className="col-4">
          <Link to="/dashboard">
            <button type="button" className="btn btn-success btn-lg btn-block">
              <h2>Reply Task </h2>
              <br />
              <br />
            </button>
          </Link>
        </div>
        <div className="col-4">
          <Link to="/dashboard">
            <button type="button" className="btn btn-success btn-lg btn-block">
              <h2>Free Text Formation </h2>
              <br />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Multimodal;
