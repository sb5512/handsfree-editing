import React, { Component } from "react";
import { getPhrases } from "../../../utils/phrases";

class QuestionLoader extends Component {
  render() {
    return (
      <div className="card-header text-center">
        <h3 className="card-title">
          {getPhrases(this.props.phraseQuestionImageCount)}
        </h3>
      </div>
    );
  }
}

export default QuestionLoader;
