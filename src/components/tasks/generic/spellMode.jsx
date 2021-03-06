import React, { Component } from "react";
import Autocomplete from "../../common/autocomplete";

class SpellMode extends Component {
  render() {
    const {
      transcript,
      hasCommand,
      transcriptObject,
      handleWordClick,
      toggleHoverOn,
      toggleHoverOff,
      toCorrectInSpellModeWord
    } = this.props;

    let toRenderDiv;
    // remember hasCommand is basically saying if "map" is spoken
    if (hasCommand && transcript) {
      toRenderDiv = (
        <React.Fragment>
          <div className="border border-white d-block p-2 bg-dark text-white">
            Mistaken word:{" "}
            <span className="border border-primary">
              {"  "} {toCorrectInSpellModeWord}
            </span>
          </div>
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
                      {...this.props}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div className="border border-white d-block p-2 bg-dark text-white">
            Updated word:{" "}
            <span className="border border-primary">
              {"  "}{" "}
              {transcriptObject
                .filter((wordObj, index, array) => {
                  return wordObj.spellMode;
                })
                .map(({ text }) => text)}
            </span>
          </div>
        </React.Fragment>
      );
    } else {
      toRenderDiv = (
        <React.Fragment>
          <div className="border border-white d-block p-2 bg-dark text-white">
            Mistaken word:{" "}
            <span className="border border-primary">
              {"  "} {toCorrectInSpellModeWord}
            </span>
          </div>
          <div className="card">
            <div className="card-body">
              {transcriptObject
                .filter((wordObj, index, array) => {
                  return wordObj.spellMode;
                })
                .map((wordObject, index) => {
                  return (
                    <React.Fragment key={index}>
                      <span
                        style={{
                          fontSize: 34,
                          cursor: "pointer",
                          paddingLeft: 20
                        }}
                        onClick={e =>
                          handleWordClick(e, wordObject.text, index)
                        }
                        onMouseOver={toggleHoverOn}
                        onMouseLeave={toggleHoverOff}
                      >
                        {wordObject.text}
                      </span>
                    </React.Fragment>
                  );
                })}
            </div>
          </div>
          <div className="border border-white d-block p-2 bg-dark text-white">
            Updated word:{" "}
            <span className="border border-primary">
              {"  "}{" "}
              {transcriptObject
                .filter((wordObj, index, array) => {
                  return wordObj.spellMode;
                })
                .map(({ text }) => text)}
            </span>
          </div>
        </React.Fragment>
      );
    }

    return toRenderDiv;
  }
}

export default SpellMode;
