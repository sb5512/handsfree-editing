import React, { Component } from "react";
import PropTypes from "prop-types";

import ImageLoader from "./imageLoader";
import Transcription from "../generic/transcription";
import SpellMode from "../generic/spellMode";
import LogdataImageTask from "../../common/logdataImageTask";
import { Image, Container, Col, Row } from "react-bootstrap";

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

class FreeTextFormationDictate extends Component {
  state = {
    clickedWord: "",
    hover: false,
    timeoutId: null,
    sessionCounter: 1
  };

  sessionCounterUp = () => {
    this.setState({ sessionCounter: this.state.sessionCounter + 1 });
  };

  handleWordClick = (e, word, index) => {
    e.target.style.backgroundColor = "#F44FFF";
    this.setState({ clickedWord: `${word} at index ${index + 1}` });
    this.props.handleWordClickToGetToMappingWithNumberState(index + 1, word);
    fetch(
      "https://hooks.slack.com/services/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",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
          channel: "test_ob_tooling",
          text: "#f4press"
        })
      }
    );
  };

  toggleHoverOn = event => {
    if (this.props.commandTag && !this.props.dwellTag) {
      event.target.style.backgroundColor = "#FFFF4F";
    } else if (!this.props.commandTag && this.props.dwellTag) {
      event.target.style.backgroundColor = "#FFFF4F";
      if (!this.state.timeoutId) {
        let timeoutId = window.setTimeout(() => {
          this.setState({ timeoutId: null }); // EDIT: added this line
          console.log("YAYYYYYYYYYYYYY 1 seconds");
          fetch(
            "https://hooks.slack.com/services/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",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: JSON.stringify({
                channel: "test_ob_tooling",
                text: "#clickmouse"
              })
            }
          );
        }, 1000);
        this.setState({ timeoutId: timeoutId });
      }
    } else {
      // TODO maybe we can send a message where a mouse cursor gets hidden
    }

    this.props.logTimeDataWhenHoveredAtWord(event.target.innerHTML);

    this.setState({ hover: true });
  };

  toggleHoverOff = event => {
    event.target.style.backgroundColor = "#FFFFFF";
    if (this.state.timeoutId) {
      window.clearTimeout(this.state.timeoutId);
      this.setState({ timeoutId: null });
    }
    this.setState({ hover: false });
  };

  render() {
    const { browserSupportsSpeechRecognition } = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    let renderDiv;

    if (this.props.spellMode) {
      renderDiv = (
        <React.Fragment>
          {/* <Transcription {...this.props} />; */}
          <SpellMode
            handleWordClick={this.handleWordClick}
            toggleHoverOn={this.toggleHoverOn}
            toggleHoverOff={this.toggleHoverOff}
            {...this.props}
            sessionCounter={this.state.sessionCounter}
            sessionCounterUp={this.sessionCounterUp}
          />
          <LogdataImageTask
            logDataPersist={this.props.logDataPersist}
            logData={this.props.logData}
            imageNumber={this.props.imageNumber}
            stopListening={this.props.stopListening}
            startListening={this.props.startListening}
            historyStates={this.props.state}
            restartTimer={this.props.restartTimer}
            {...this.props}
            sessionCounter={this.state.sessionCounter}
            sessionCounterUp={this.sessionCounterUp}
          />
        </React.Fragment>
      );
    } else {
      renderDiv = (
        <React.Fragment>
          <ImageLoader {...this.props} loadedImage={this.props.loadedImage} />{" "}
          <Container>
            <Transcription
              handleWordClick={this.handleWordClick}
              toggleHoverOn={this.toggleHoverOn}
              toggleHoverOff={this.toggleHoverOff}
              clickedWord={this.state.clickedWord}
              {...this.props}
            />
          </Container>
          <LogdataImageTask
            logDataPersist={this.props.logDataPersist}
            logData={this.props.logData}
            imageNumber={this.props.imageNumber}
            stopListening={this.props.stopListening}
            startListening={this.props.startListening}
            historyStates={this.props.state}
            restartTimer={this.props.restartTimer}
            {...this.props}
            sessionCounter={this.state.sessionCounter}
            sessionCounterUp={this.sessionCounterUp}
          />
        </React.Fragment>
      );
    }

    return renderDiv;
  }
}

FreeTextFormationDictate.propTypes = propTypes;

export default FreeTextFormationDictate;
