import React, { Component } from "react";
import FreeTextFormationDictate from "./freeTextFormationDictate";
import keydown from "react-keydown";

class FreeTextFormationTask extends Component {
  state = {
    oldTranscript: ""
  };

  setOldTranscript = oldTranscript => {
    this.setState({ oldTranscript: oldTranscript });
  };

  componentWillReceiveProps({ keydown }) {
    if (keydown.event) {
      if (keydown.event.which === 66) {
        this.props.onBackButtonClick();
        this.props.state.history.push("/");
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <FreeTextFormationDictate
            {...this.props}
            setOldTranscript={this.setOldTranscript}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default keydown("b", "B", "1", "2", "3")(FreeTextFormationTask);
