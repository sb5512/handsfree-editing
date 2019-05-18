import React, { Component } from "react";
import Autocomplete from "../../common/autocomplete";
import commandsENUM from "./commandENUM";

class Transcription extends Component {
  state = {
    clickedWord: "",
    hover: false,
    editMode: false,
    selectMode: false,
    phraseCount: 0
  };

  handleWordClick = (e, word, index) => {
    e.target.style.backgroundColor = "#F44FFF";
    this.setState({ clickedWord: `${word} at index ${index}` });
  };

  toggleHoverOn = event => {
    event.target.style.backgroundColor = "#FFFF4F";
    this.props.resetTranscript();
    // this.props.setOldTranscript(this.props.transcript);
    this.setState({ hover: true });
  };

  toggleHoverOff = event => {
    event.target.style.backgroundColor = "#FFFFFF";
    this.setState({ hover: false });
  };

  editModeFn = e => {
    this.setState({ editMode: true });
  };

  render() {
    const { transcript, transcriptArr, hasCommand, command } = this.props;
    let isCommand = hasCommand;

    return (
      <div className="card">
        <div className="card-body">
          {isCommand
            ? transcript &&
              transcriptArr.map((word, index) => {
                return (
                  <React.Fragment key={index}>
                    {/* <span
                      onClick={e => this.handleWordClick(e, word, index)}
                      onMouseOver={this.toggleHoverOn}
                      onMouseLeave={this.toggleHoverOff}
                    >
                      {word} {index}
                    </span>
                    <br /> */}

                    <Autocomplete
                      suggestions={["Hillo", "Halo", "Hi"]}
                      text={word}
                      mappingNumber={index}
                      selectMode={this.state.selectMode}
                    />
                  </React.Fragment>
                );
              })
            : isCommand
            ? transcript &&
              transcriptArr.map((word, index) => {
                return (
                  <React.Fragment key={index}>
                    <span
                      style={{ fontSize: 34, cursor: "pointer" }}
                      onClick={e => this.handleWordClick(e, word, index)}
                      onMouseOver={this.toggleHoverOn}
                      onMouseLeave={this.toggleHoverOff}
                    >
                      {word}
                    </span>
                  </React.Fragment>
                );
              })
            : // If not a command
              transcript &&
              transcriptArr.map((word, index) => {
                return (
                  <React.Fragment key={index}>
                    <span
                      style={{ fontSize: 34, cursor: "pointer" }}
                      onClick={e => this.handleWordClick(e, word, index)}
                      onMouseOver={this.toggleHoverOn}
                      onMouseLeave={this.toggleHoverOff}
                    >
                      {word}
                    </span>

                    {/* <Autocomplete
                      suggestions={["Hillo", "Halo", "Hi"]}
                      text={word}
                      mappingNumber={index}
                      selectMode={this.state.selectMode}
                    /> */}
                  </React.Fragment>
                );
              })}
        </div>
      </div>
    );
  }
}

export default Transcription;
