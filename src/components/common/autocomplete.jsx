import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: []
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestion: this.props.showSuggestion,
      // What the user has entered
      userInput: this.props.text,
      indexing: this.props.indexing,
      currentHoverText: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ showSuggestion: nextProps.showSuggestion });
  }

  onChange = e => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;
    const filteredSuggestions = suggestions;
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestion: true
    });
  };

  onClick = e => {
    // Update the user input and reset the rest of the state
    if (!this.props.selectMode) {
      this.setState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestion: false,
        userInput: e.currentTarget.innerText
      });
    }
  };

  onHoverSelectable = event => {
    this.setState({
      userInput: event.currentTarget.textContent
    });
  };

  render() {
    const { onClick, onHoverSelectable } = this;

    let suggestionsListComponent;
    if (this.state.showSuggestion) {
      suggestionsListComponent = (
        <ul className="suggestions">
          {this.props.suggestions.map((suggestion, index) => {
            let className; // ??? maybe some css setup
            return (
              <li
                className={className}
                key={suggestion}
                onMouseEnter={onHoverSelectable}
                onClick={onClick}
              >
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    } else {
      suggestionsListComponent = <span />;
    }

    return (
      <Fragment>
        <span style={{ fontSize: 34, cursor: "pointer", paddingLeft: 20 }}>
          {this.state.userInput}
          {suggestionsListComponent}
        </span>
        {this.state.indexing}
      </Fragment>
    );
  }
}

export default Autocomplete;
