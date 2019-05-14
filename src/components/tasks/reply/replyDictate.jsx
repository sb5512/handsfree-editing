import React, { Component } from "react";
import PropTypes from "prop-types";
import Scriptor from "../../common/scriptor";
import SpeechRecognition from "../../common/speech";
import Logdata from "../../common/logdata";
import Suggestion from "../../common/suggestion";
import Autocomplete from "../../common/autocomplete";
import getReplyQuestions from "../../../utils/replyQuestions";

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

class ReplyDictate extends Component {
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
      finalTranscript,
      previousTranscript,
      resetTranscript,
      stopListening,
      startListening,
      commands,
      resetCommands,
      browserSupportsSpeechRecognition
    } = this.props;

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

        <div className="row">
          <div className="col-12">
            <div className="card">
              {/* // Here begins the code for phrases */}
              {/* <Scriptor
                resetTranscript={resetTranscript}
                commands={commands}
                resetCommands={resetCommands}
              /> */}
              {/* // Here Ends the code for phrases */}
              <div className="card-header text-center">
                <h3 className="card-title">
                  {getReplyQuestions()[this.state.phraseCount]}
                </h3>
              </div>

              <div className="card-body">
                {transcript}
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
            <Logdata logdata={previousTranscript} transcript={transcript} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ReplyDictate.propTypes = propTypes;

export default SpeechRecognition(ReplyDictate);
