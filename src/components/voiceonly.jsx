import React, { Component } from "react";
import { Link } from "react-router-dom";

class Voiceonly extends Component {
  state = {};

  render() {
    return (
      <div className="container">
        <button className="btn btn-light btn-lg float-right text-center">
          <i className="fa fa-microphone" />
        </button>
        <div className="row justify-content-between">
          <div className="col-4">
            <Link to="/dashboard">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
              >
                <h2>Copy Task</h2>
                <br />
                <h1>1</h1>
              </button>
            </Link>
          </div>
          <div className="col-4">
            <Link to="/dashboard">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
              >
                <h2>Reply Task </h2>
                <br />
                <h1>2</h1>
              </button>
            </Link>
          </div>
          <div className="col-4">
            <Link to="/dashboard">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
              >
                <h2>Free Text Formation </h2>
                <br />
                <h1>3</h1>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Voiceonly;
