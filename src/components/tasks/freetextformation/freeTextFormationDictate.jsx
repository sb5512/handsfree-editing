import React, { Component } from "react";
import PropTypes from "prop-types";
import Logdata from "../../common/logdata";
import Autocomplete from "../../common/autocomplete";

import Utils from "../../../utils/Utils";

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
    editMode: false,
    selectMode: false,
    oldTranscript: "",
    phraseCount: 0
  };

  handleWordClick = (e, word, index) => {
    e.target.style.backgroundColor = "#F44FFF";
    this.setState({ clickedWord: `${word} at index ${index}` });
  };

  toggleHoverOn = event => {
    event.target.style.backgroundColor = "#FFFF4F";
    this.setState({ hover: true });
  };

  toggleHoverOff = event => {
    event.target.style.backgroundColor = "#FFFFFF";
    this.setState({ hover: false });
  };

  editModeFn = e => {
    this.setState({ editMode: true });
  };

  handleNext() {
    this.setState({
      phraseCount: this.state.phraseCount + 1,
      selectMode: false
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log("component recieved props after speaking");
    if (
      this.props.commands &&
      this.props.commands[0].split(" ")[
        this.props.commands[0].split(" ").length - 1
      ] === "next"
    ) {
      this.handleNext();
      this.props.resetTranscript();
    }
    if (
      this.props.commands &&
      this.props.commands[0].split(" ")[
        this.props.commands[0].split(" ").length - 1
      ] === "select"
    ) {
      this.setState({ selectMode: true });
    }
  }

  render() {
    const {
      transcript,
      previousTranscript,
      resetTranscript,
      stopListening,
      startListening,
      commands,
      resetCommands,
      browserSupportsSpeechRecognition
    } = this.props;

    const helperTextCanDelete = "Hello this is the text to show";
    const helperTextArr = helperTextCanDelete.split(" ");

    // To get random images - Begins
    let imageNumber = Utils.getRandomInt(4);
    let toLoadImage = require(`../../../fixtures/image${imageNumber}.jpg`);
    // To get random images - Ends

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    let editClass = "";
    let styleEdit = { fontSize: 34, cursor: "pointer" };
    if (
      this.props.commands &&
      this.props.commands[0].split(" ")[
        this.props.commands[0].split(" ").length - 1
      ] === "edit"
    ) {
      editClass = "border border-primary m-4 ";
      styleEdit = { fontSize: 34, cursor: "pointer" };
    }

    const transcriptArr = transcript.split(/(\s+)/);
    return (
      <React.Fragment>
        {/* Buttons for start reset and stop STARTS */}
        {/* <div className="row">
          <div className="col">
            <button className="btn btn-primary" onClick={startListening}>
              Start
            </button>
            <button className="btn btn-warning m-2" onClick={resetTranscript}>
              Reset
            </button>
            <button className="btn btn-danger " onClick={stopListening}>
              Stop
            </button>
          </div>
        </div> */}
        {/* Buttons for start reset and stop ENDS */}

        {/* For Image */}
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col col-lg-4">
              <img
                src={toLoadImage}
                className="img-fluid img-thumbnail"
                alt="freetext"
              />
            </div>
          </div>
        </div>
        <br />
        {/* For Image Ends*/}

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                {/* {transcript} */}
                {/* {helperTextCanDelete} */}
                {helperTextArr.map((word, index) => {
                  return (
                    <Autocomplete
                      suggestions={["Hillo", "Halo", "Hi"]}
                      text={word}
                      selectMode={this.state.selectMode}
                    />
                  );
                })}

                {transcript &&
                  transcriptArr.map((word, index) => {
                    if (word !== "edit")
                      return (
                        <React.Fragment key={index}>
                          {/* <span
                            className={editClass}
                            onClick={e => this.handleWordClick(e, word, index)}
                            onMouseOver={this.toggleHoverOn}
                            onMouseLeave={this.toggleHoverOff}
                            style={styleEdit}
                          >
                            {word}
                          </span> */}

                          {/* <Autocomplete
                            suggestions={["Hillo", "Halo", "Hi"]}
                            text={word}
                            selectMode={this.state.selectMode}
                          /> */}
                        </React.Fragment>
                      );
                    return null;
                  })}
              </div>
            </div>

            <div className="border border-white d-block p-2 bg-dark text-white">
              You clicked on the word:{" "}
              <span className="border border-primary">
                {"  "} {this.state.clickedWord}
              </span>
            </div>

            {/* // Log data info */}
            <br />
            {/* <Logdata logdata={previousTranscript} transcript={transcript} /> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

FreeTextFormationDictate.propTypes = propTypes;

export default FreeTextFormationDictate;
