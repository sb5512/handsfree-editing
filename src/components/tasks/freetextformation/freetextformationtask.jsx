import React, { Component } from "react";
import FreeTextFormationDictate from "./freeTextFormationDictate";
import keydown from "react-keydown";
import { Image, Container, Col, Row } from "react-bootstrap";

import ReactCountdownClock from "react-countdown-clock";

class FreeTextFormationTask extends Component {
  state = { readyToListen: false, counterTimer: 3 };

  componentWillReceiveProps({ keydown }) {
    if (keydown.event) {
      if (keydown.event.which === 66) {
        this.props.resetTranscript();
        this.props.stopListening();
        this.props.state.history.goBack();
      }
    }
  }

  microphoneButtonClick = () => {
    if (this.state.readyToListen) {
      console.log("clicked to start listening");
      this.setState({ readyToListen: false });
      this.props.stopListening();
    } else {
      console.log("clicked to start listening");
      this.setState({ readyToListen: true });
      this.props.startListening();
    }
  };

  restartTimer = () => {
    this.props.stopListening();
    this.setState({
      readyToListen: false,
      counterTimer: this.state.counterTimer + 1
    });
  };

  myCallback = () => {
    this.setState({ readyToListen: true });
    this.props.startListening();
  };

  render() {
    let speechButton = "";
    this.state.readyToListen
      ? (speechButton = (
          <button
            className="btn btn-success btn-lg text-center"
            onClick={this.microphoneButtonClick}
          >
            <i className="fa fa-microphone" />
          </button>
        ))
      : (speechButton = (
          <button
            className="btn btn-danger btn-lg text-center"
            onClick={this.microphoneButtonClick}
          >
            <i className="fa fa-microphone" />
          </button>
        ));
    return (
      <React.Fragment>
        <Row>
          <Col xs={6} md={10}>
            <ReactCountdownClock
              key={this.state.counterTimer}
              seconds={3}
              color="#000"
              alpha={0.9}
              size={100}
              onComplete={this.myCallback}
            />
          </Col>
          <Col xs={6} md={2}>
            {speechButton}
          </Col>
        </Row>{" "}
        <Row>
          <div className="container-fluid">
            <FreeTextFormationDictate
              {...this.props}
              {...this.state}
              restartTimer={this.restartTimer}
            />
          </div>{" "}
        </Row>
      </React.Fragment>
    );
  }
}

export default keydown("b", "B", "1", "2", "3")(FreeTextFormationTask);
