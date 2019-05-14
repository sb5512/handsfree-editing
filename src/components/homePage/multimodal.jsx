import React, { Component } from "react";
import { Link } from "react-router-dom";
import keydown from "react-keydown";

class Multimodal extends Component {
  componentWillReceiveProps({ keydown }) {
    if (keydown.event) {
      if (keydown.event.which === 49) {
        this.props.startListening();
        this.props.state.history.push("/copytask");
      } else if (keydown.event.which === 50) {
        this.props.startListening();
        this.props.state.history.push("/replytask");
      } else if (keydown.event.which === 51) {
        this.props.startListening();
        this.props.state.history.push("/freetextformationtask");
      } else {
        this.props.stopListening();
        this.props.state.history.push("/");
      }
    }
  }

  render() {
    return (
      <div className="container">
        <button className="btn btn-light btn-lg float-right text-center">
          <i className="fa fa-microphone" />
          <br />
          <i className="fa fa-eye" />
        </button>

        <div className="row justify-content-between">
          <div className="col-4">
            <Link to="/copytask">
              <button
                onClick={this.props.startListening}
                type="button"
                className="btn btn-success btn-lg btn-block"
              >
                <h2>Copy Task</h2>
                <br />
                <br />
              </button>
            </Link>
          </div>
          <div className="col-4">
            <Link to="/replytask">
              <button
                onClick={this.props.startListening}
                type="button"
                className="btn btn-success btn-lg btn-block"
              >
                <h2>Reply Task </h2>
                <br />
                <br />
              </button>
            </Link>
          </div>
          <div className="col-4">
            <Link to="/freetextformationtask">
              <button
                onClick={this.props.startListening}
                type="button"
                className="btn btn-success btn-lg btn-block"
              >
                <h2>Free Text Formation </h2>
                <br />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
// export default Multimodal;
export default keydown("b", "B", "1", "2", "3")(Multimodal);
