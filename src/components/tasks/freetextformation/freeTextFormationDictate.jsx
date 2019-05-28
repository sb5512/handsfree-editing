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
    const { transcript, browserSupportsSpeechRecognition } = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    const transcriptArr = transcript.split(/(\s+)/);

    return (
      <React.Fragment>
        <ImageLoader loadedImage={this.props.loadedImage} />

        <div className="row">
          <div className="col-12">
            <Transcription
              {...this.props}
              transcriptArr={transcriptArr}
              isCommand={this.props.state.hasCommand}
              command={this.props.state.command}
            />

            {/* Begins: Have to refactor as component */}
            <div className="border border-white d-block p-2 bg-dark text-white">
              You clicked on the word:{" "}
              <span className="border border-primary">
                {/* {"  "} {this.state.clickedWord} */}
              </span>
            </div>
            {/* Ends: Have to refactor as component */}

            {/* <Logdata logdata={previousTranscript} transcript={transcript} /> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

FreeTextFormationDictate.propTypes = propTypes;

export default FreeTextFormationDictate;
