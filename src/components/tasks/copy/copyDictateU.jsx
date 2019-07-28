import React, { Component } from "react";
import PropTypes from "prop-types";

import Transcription from "../generic/transcription";
import Logdata from "../../common/logdata";
import SpellMode from "../generic/spellMode";
import PhraseLoader from "./phraseLoader";

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

class CopyDictate extends Component {
  state = {
    clickedWord: "",
    hover: false,
    timeoutId: null
  };

  handleWordClick = (e, word, index) => {
    e.target.style.backgroundColor = "#F44FFF";
    this.setState({ clickedWord: `${word} at index ${index + 1}` });
    this.props.handleWordClickToGetToMappingWithNumberState(index + 1, word);
  };

  toggleHoverOn = event => {
    event.target.style.backgroundColor = "#FFFF4F";
    if (!this.state.timeoutId) {
      let timeoutId = window.setTimeout(() => {
        this.setState({ timeoutId: null }); // EDIT: added this line
        console.log("YAYYYYYYYYYYYYY 1 seconds");
        fetch(
          "https://hooks.slack.com/services/TKU82KBUG/BLBJPBTHC/igh31aG7hFDwYWRSTGRxiX7",
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
          <SpellMode
            handleWordClick={this.handleWordClick}
            toggleHoverOn={this.toggleHoverOn}
            toggleHoverOff={this.toggleHoverOff}
            {...this.props}
          />
          <Logdata
            logDataPersist={this.props.logDataPersist}
            logData={this.props.logData}
            phraseQuestionImageCount={this.props.phraseQuestionImageCount}
            stopListening={this.props.stopListening}
            startListening={this.props.startListening}
            historyStates={this.props.state}
          />
        </React.Fragment>
      );
    } else {
      renderDiv = (
        <React.Fragment>
          <PhraseLoader {...this.props} loadedImage={this.props.loadedImage} />{" "}
          <Transcription
            handleWordClick={this.handleWordClick}
            toggleHoverOn={this.toggleHoverOn}
            toggleHoverOff={this.toggleHoverOff}
            clickedWord={this.state.clickedWord}
            {...this.props}
          />
          <Logdata
            logDataPersist={this.props.logDataPersist}
            logData={this.props.logData}
            phraseQuestionImageCount={this.props.phraseQuestionImageCount}
            stopListening={this.props.stopListening}
            startListening={this.props.startListening}
            historyStates={this.props.state}
          />
        </React.Fragment>
      );
    }

    return renderDiv;
  }
}

CopyDictate.propTypes = propTypes;

export default CopyDictate;
