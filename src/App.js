import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./components/navbar";
import "./App.css";
import Voiceonly from "./components/voiceonly";
import Multimodal from "./components/multimodal";
// import Dashboard from "./components/admin/dashboard";
import { Link } from "react-router-dom";
import CopyTask from "./components/copytask";

class App extends Component {
  render() {
    return (
      <div>
        <Link to="/">
          <button className="btn btn-light btn-lg btn-block-height text-center">
            <i class="fa fa-chevron-up" />
          </button>
        </Link>
        <br />
        <div className="content">
          <Switch>
            <Route
              path="/dashboard"
              render={props => <CopyTask {...props} />}
            />
            <Route
              path="/voiceonly"
              render={props => <Voiceonly {...props} />}
            />
            <Route
              path="/multimodal"
              render={props => <Multimodal {...props} />}
            />
            <Route path="/" exact component={NavBar} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
