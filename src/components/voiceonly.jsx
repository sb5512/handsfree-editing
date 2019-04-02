import React, { Component } from "react";
import { Link } from "react-router-dom";

import keydown from "react-keydown";

class Voiceonly extends Component {
  componentWillReceiveProps({ keydown }) {
    if (keydown.event) {
      if (keydown.event.which === 49) {
        this.props.history.push("/copytask");
      } else if (keydown.event.which === 50) {
        this.props.history.push("/replytask");
      } else if (keydown.event.which === 51) {
        this.props.history.push("/freetextformationtask");
      } else {
        this.props.history.push("/");
      }
    }
  }
  render() {
    return (
      <div className="container">
        <button className="btn btn-light btn-lg float-right text-center">
          <i className="fa fa-microphone" />
        </button>
        <div className="row justify-content-between">
          <div className="col-4">
            <Link to="/copytask">
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
            <Link to="/replytask">
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
            <Link to="/freetextformationtask">
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

// export default Voiceonly;

export default keydown("b", "B", "1", "2", "3")(Voiceonly);
