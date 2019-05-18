import React, { Component } from "react";
import FreeTextFormationDictate from "./freeTextFormationDictate";
import keydown from "react-keydown";

import ReactCountdownClock from "react-countdown-clock";

class FreeTextFormationTask extends Component {
  componentWillReceiveProps({ keydown }) {
    if (keydown.event) {
      if (keydown.event.which === 66) {
        this.props.resetTranscript();
        this.props.stopListening();
        this.props.state.history.goBack();
      }
    }
  }

  myCallback = () => {
    this.setState({ readyToListen: true });
    this.props.startListening();
  };
  state = { readyToListen: false };

  render() {
    let speechButton = "";
    this.state.readyToListen
      ? (speechButton = (
          <button className="btn btn-success btn-lg float-left text-center">
            <i className="fa fa-microphone" />
          </button>
        ))
      : (speechButton = (
          <button className="btn btn-danger btn-lg float-left text-center">
            <i className="fa fa-microphone" />
          </button>
        ));
    return (
      <React.Fragment>
        <div>
          <ReactCountdownClock
            seconds={10}
            color="#000"
            alpha={0.9}
            size={100}
            onComplete={this.myCallback}
          />
          {speechButton}
        </div>
        <div className="container-fluid">
          <FreeTextFormationDictate {...this.props} {...this.state} />
        </div>
      </React.Fragment>
    );
  }
}

export default keydown("b", "B", "1", "2", "3")(FreeTextFormationTask);
