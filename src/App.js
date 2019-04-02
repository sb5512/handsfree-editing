import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Route, Switch, Redirect } from "react-router-dom";

import "./App.css";

import NavBar from "./components/navbar";
import Voiceonly from "./components/voiceonly";
import Multimodal from "./components/multimodal";
import CopyTask from "./components/tasks/copytask";
import ReplyTask from "./components/tasks/replytask";
import FreeTextFormationTask from "./components/tasks/freetextformationtask";

class App extends Component {
  render() {
    return (
      <div tabIndex="1">
        <div>
          {" "}
          Note:
          https://stackoverflow.com/questions/52061476/cancel-all-subscriptions-and-asyncs-in-the-componentwillunmount-method-how
        </div>
        <Link to="/">
          <button
            id="backButton"
            className="btn btn-light btn-lg btn-block-height text-center"
          >
            <i className="fa fa-chevron-up">(b)</i>
          </button>
        </Link>
        <br />
        <div tabIndex="0" className="content">
          <Switch>
            <Route path="/copytask" render={props => <CopyTask {...props} />} />
            <Route
              path="/replytask"
              render={props => <ReplyTask {...props} />}
            />
            <Route
              path="/freetextformationtask"
              render={props => <FreeTextFormationTask {...props} />}
            />
            <Route
              path="/voiceonly"
              render={props => <Voiceonly {...props} />}
            />
            <Route
              path="/multimodal"
              render={props => <Multimodal {...props} />}
            />
            <Route path="/" exact render={props => <NavBar {...props} />} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
// export default keydown("m", "v", "b")(App);
