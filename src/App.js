import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Route, Switch, Redirect } from "react-router-dom";
// import SpeechRecognition from "react-speech-recognition";

import "./App.css";
import PropTypes from "prop-types";

import NavBar from "./components/homePage/navbar";
import Voiceonly from "./components/homePage/voiceonly";
import Multimodal from "./components/homePage/multimodal";

import CopyTask from "./components/tasks/copy/copytask";
import ReplyTask from "./components/tasks/reply/replytask";
import FreeTextFormationTask from "./components/tasks/freetextformation/freetextformationtask";
import SpeechRecognition from "./components/common/speechRecognition";

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

class App extends Component {
  render() {
    return (
      <div tabIndex="0" className="content">
        <Switch>
          <Route
            path="/copytask"
            render={props => <CopyTask state={props} {...this.props} />}
          />
          <Route
            path="/replytask"
            render={props => <ReplyTask state={props} {...this.props} />}
          />
          <Route
            path="/freetextformationtask"
            render={props => (
              <FreeTextFormationTask
                state={props}
                loadedImage={true}
                {...this.props}
              />
            )}
          />
          <Route
            path="/voiceonly"
            render={props => <Voiceonly state={props} {...this.props} />}
          />
          <Route
            path="/multimodal"
            render={props => <Multimodal state={props} {...this.props} />}
          />
          <Route
            path="/"
            exact
            render={props => <NavBar state={props} {...this.props} />}
          />
          <Redirect to="/not-found" />
        </Switch>
      </div>
    );
  }
}

const options = {
  autoStart: false
};

App.propTypes = propTypes;

// export default SpeechRecognition(options)(App);
export default SpeechRecognition(options)(App);
