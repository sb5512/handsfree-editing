import React, { Component } from "react";
import Autocomplete from "../../common/autocomplete";
import ClickedWord from "./clickedWord";

class Transcription extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.finalTranscript !== nextProps.finalTranscript) {
      // Let us check if the wordObject has the longest word
      const filteredTranscribedObject = this.props.transcriptObject.filter(
        wordObject => {
          return !this.props.suggestionList[wordObject.text];
        }
      );
      if (filteredTranscribedObject.length > 0) {
        console.log(
          "YOOOooooooooooooooooooooo honita filtered object",
          filteredTranscribedObject
        );

        let longestObj = filteredTranscribedObject.reduce(function(a, b) {
          return a.text.length > b.text.length ? a : b;
        });

        console.log(
          "THE LONGEST WORD IN THIS TRANSCRIPTION SECTION IS",
          longestObj
        );
        filteredTranscribedObject.map((wordObject, index) => {
          // if wordbject.text has already been fetched i.e. suggestionlist has it already than ignore fetch.
          console.log(
            "I ACTUALLY THOUGHT THIS WAS A SUGGESTION YOYA ",
            this.props.suggestionList[wordObject.text]
          );
          if (!this.props.suggestionList[wordObject.text]) {
            fetch(`https://api.datamuse.com//words?sl=${wordObject.text}&max=5`)
              .then(res => res.json())
              .then(data => {
                let answer = data.map(el => el.word);
                console.log("Fetched information are: ", data);
                this.props.setSuggestionList(
                  wordObject.text,
                  answer,
                  wordObject.text === longestObj.text
                );
                // this.setState({ suggestions: answer });
              })
              .catch //this.setState({ suggestions: ["Loading..."] })
              ();
          }
        });
      }
    }
  }

  render() {
    const {
      transcript,
      hasCommand,
      transcriptObject,
      handleWordClick,
      toggleHoverOn,
      toggleHoverOff
    } = this.props;

    let toRenderDiv;

    // Normal mode. This is where we show regular text and also autocomplete text
    // hasCommand = map
    if (hasCommand && transcript) {
      toRenderDiv = (
        <div className="card">
          <div className="card-body">
            {transcriptObject.map((wordObject, index) => {
              return (
                <React.Fragment key={index}>
                  <Autocomplete
                    suggestions={this.props.suggestionList[wordObject.text]}
                    text={wordObject.text}
                    showSuggestion={wordObject.showSuggestion}
                    indexing={index}
                    {...this.props}
                  />
                </React.Fragment>
              );
            })}
          </div>
          <ClickedWord clickedWord={this.props.clickedWord} />
        </div>
      );
    } // This else is when no command is spoken i.e. map or spell mode is not currently happening. All normal
    else {
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
                    onClick={e => handleWordClick(e, wordObject.text, index)}
                    onMouseOver={toggleHoverOn}
                    onMouseLeave={toggleHoverOff}
                  >
                    {wordObject.text}
                  </span>
                </React.Fragment>
              );
            })}
          </div>

          <ClickedWord clickedWord={this.props.clickedWord} />
        </div>
      );
    }

    return toRenderDiv;
  }
}

export default Transcription;
