import React, { Component } from "react";
import { Link } from "react-router-dom";
import keydown from "react-keydown";

class Multimodal extends Component {
  componentWillReceiveProps({ keydown }) {
    if (keydown.event) {
      if (keydown.event.which === 49) {
        this.props.state.history.push("/copytask");
      } else if (keydown.event.which === 50) {
        this.props.state.history.push("/replytask");
      } else if (keydown.event.which === 51) {
        this.props.state.history.push("/freetextformationtask");
      } else {
        this.props.resetTranscript();
        this.props.stopListening();
        this.props.state.history.goBack();
      }
    }
  }

  onBackButtonClick = () => {
    this.props.resetTranscript();
    this.props.abortListening();
    this.props.state.history.goBack();
  };

  render() {
    return (
      <div className="container">
        {/* <button
          onClick={this.onBackButtonClick}
          id="backButton"
          className="btn btn-light btn-lg btn-block-height text-center"
        >
          <i className="fa fa-chevron-up">(b)</i>
        </button> */}

        <div className="row">
          <button className="btn btn-light btn-lg float-right text-center">
            <i className="fa fa-microphone" />
            <br />
            <i className="fa fa-eye" />
          </button>
        </div>
        <div className="row">
          <div className="col-3">
            <Link to="/copytaskcommand">
              <button type="button" className="btn btn-success btn-block ">
                <br />
                <br />
                <h2>Copy Task Command Tag</h2>
                <br />
                <br />
              </button>
            </Link>
          </div>
          <div className="col-3">
            <Link to="/copytaskdwell">
              <button type="button" className="btn btn-success btn-block">
                <br />
                <br />
                <h2>Copy Task Dwell Tag</h2>
                <br />
                <br />
              </button>
            </Link>
          </div>

          {/* <div className="col-3">
            <Link to="/replytask">
              <button type="button" className="btn btn-primary btn-block">
                <br />
                <br />
                <h2>Reply Task </h2>
                <br />
                <br />
              </button>
            </Link>
          </div> */}
          <div className="col-3">
            <Link to="/freetextformationtaskcommand">
              <button type="button" className="btn btn-primary btn-block">
                <br />
                <br />
                <h2>Free Text formation Command </h2>
                <br />
              </button>
            </Link>
          </div>
          <div className="col-3">
            <Link to="/freetextformationtaskdwell">
              <button type="button" className="btn btn-primary btn-block">
                <br />
                <br />
                <h2>Free Text Formation Dwell</h2>
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
