import React, { Component } from "react";
import ReplyDictate from "./replyDictate";
import keydown from "react-keydown";

class ReplyTask extends Component {
  componentWillReceiveProps({ keydown }) {
    if (keydown.event) {
      if (keydown.event.which === 66) {
        this.props.onBackButtonClick();
        this.props.state.history.push("/");
      }
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

    return (
      <div className="container-fluid">
        <ReplyDictate {...this.props} />
      </div>
    );
  }
}

export default keydown("b", "B", "1", "2", "3")(ReplyTask);
