import React, { Component } from "react";
import Autocomplete from "../../common/autocomplete";
import commandsENUM from "./commandENUM";
import SpellMode from "./spellMode";

class Transcription extends Component {
  state = {
    clickedWord: "",
    hover: false,
    selectMode: false,
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

  render() {
    const { transcript, hasCommand, transcriptObject, spellMode } = this.props;

    let toRenderDiv;
    // If in spell mode
    if (spellMode) {
      toRenderDiv = (
        <SpellMode
          handleWordClick={this.handleWordClick}
          toggleHoverOn={this.toggleHoverOn}
          toggleHoverOff={this.toggleHoverOff}
          {...this.props}
        />
      );
    } else {
      // Normal mode. This is where we show regular text and also autocomplete text
      if (hasCommand && transcript) {
        toRenderDiv = (
          <div className="card">
            <div className="card-body">
              {transcriptObject.map((wordObject, index) => {
                return (
                  <React.Fragment key={index}>
                    <Autocomplete
                      suggestions={wordObject.suggestions}
                      text={wordObject.text}
                      showSuggestion={wordObject.showSuggestion}
                      indexing={index}
                      selectMode={this.state.selectMode}
                      {...this.props}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );
      } else {
        toRenderDiv = (
          <div className="card">
            <div className="card-body">
              {transcriptObject.map((wordObject, index) => {
                return (
                  <React.Fragment key={index}>
                    <span
                      style={{
                        fontSize: 34,
                        cursor: "pointer",
                        paddingLeft: 20
                      }}
                      onClick={e =>
                        this.handleWordClick(e, wordObject.text, index)
                      }
                      onMouseOver={this.toggleHoverOn}
                      onMouseLeave={this.toggleHoverOff}
                    >
                      {wordObject.text}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );
      }
    }

    return toRenderDiv;
  }
}

export default Transcription;
