import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
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
  componentDidMount() {
    document.title = "Handsfree editing - Gaze and voice";
  }
  render() {
    return (
      <div tabIndex="0" className="content">
        <Switch>
          <Route
            path="/copytask"
            render={props => (
              <CopyTask
                state={props}
                commandTag={false}
                dwellTag={false}
                {...this.props}
              />
            )}
          />
          <Route
            path="/copytaskcommand"
            render={props => (
              <CopyTask
                state={props}
                commandTag={true}
                dwellTag={false}
                {...this.props}
              />
            )}
          />
          <Route
            path="/copytaskdwell"
            render={props => (
              <CopyTask
                state={props}
                commandTag={false}
                dwellTag={true}
                {...this.props}
              />
            )}
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
                commandTag={false}
                dwellTag={false}
                {...this.props}
              />
            )}
          />
          <Route
            path="/freetextformationtaskcommand"
            render={props => (
              <FreeTextFormationTask
                state={props}
                loadedImage={true}
                commandTag={true}
                dwellTag={false}
                {...this.props}
              />
            )}
          />
          <Route
            path="/freetextformationtaskdwell"
            render={props => (
              <FreeTextFormationTask
                state={props}
                loadedImage={true}
                commandTag={false}
                dwellTag={true}
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
        <Navbar bg="dark" variant="dark" fixed="bottom">
          <Navbar.Brand className="font-weight-bold mx-auto">map</Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">
            cancel
          </Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">
            delete
          </Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">
            finish
          </Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">
            spell
          </Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">
            lowercase
          </Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">
            clear
          </Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">
            insert
          </Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">
            space
          </Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">next</Navbar.Brand>
          <Navbar.Brand className="font-weight-bold mx-auto">
            click
          </Navbar.Brand>
        </Navbar>
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
