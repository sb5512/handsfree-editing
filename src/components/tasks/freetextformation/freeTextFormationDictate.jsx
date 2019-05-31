import React, { Component } from "react";
import PropTypes from "prop-types";

import ImageLoader from "./imageLoader";
import Transcription from "./transcription";

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

class FreeTextFormationDictate extends Component {
  render() {
    const { browserSupportsSpeechRecognition } = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    let renderDiv;

    if (this.props.spellMode) {
      renderDiv = <Transcription {...this.props} />;
    } else {
      renderDiv = (
        <React.Fragment>
          <ImageLoader loadedImage={this.props.loadedImage} />{" "}
          <Transcription {...this.props} />
          {/* Begins: Have to refactor as component */}
          <div className="border border-white d-block p-2 bg-dark text-white">
            You clicked on the word:{" "}
            <span className="border border-primary">
              {/* {"  "} {this.state.clickedWord} */}
            </span>
          </div>
          {/* Ends: Have to refactor as component */}
          {/* <Logdata logdata={previousTranscript} transcript={transcript} /> */}
        </React.Fragment>
      );
    }

    return renderDiv;
  }
}

FreeTextFormationDictate.propTypes = propTypes;

export default FreeTextFormationDictate;
