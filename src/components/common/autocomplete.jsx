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
      showSuggestions: false,
      // What the user has entered
      userInput: this.props.text,
      mappingNumber: this.props.mappingNumber,
      currentHoverText: ""
    };
  }
  onChange = e => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions;
    // const filteredSuggestions = suggestions.filter(
    //   suggestion =>
    //     suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    // );

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true
    });
  };

  onLeave = e => {
    this.setState({
      showSuggestions: false
    });
  };

  onClick = e => {
    // Update the user input and reset the rest of the state
    if (!this.props.selectMode) {
      this.setState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: e.currentTarget.innerText
      });
    }
  };

  onHoverSelectable = event => {
    console.log(event.currentTarget.textContent);
    //this.setState({ currentHoverText: event.currentTarget.textContent });
    this.setState({ userInput: event.currentTarget.textContent });
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      onHoverSelectable,
      onLeave,
      state: { activeSuggestion, filteredSuggestions, showSuggestions }
    } = this;

    let suggestionsListComponent;
    // let userVal = this.state.userInput;
    // if (this.props.selectMode) {
    //   userVal = this.state.currentHoverText;
    // }
    if (!this.props.selectMode) {
      if (showSuggestions) {
        if (filteredSuggestions.length) {
          suggestionsListComponent = (
            <ul className="suggestions">
              {filteredSuggestions.map((suggestion, index) => {
                let className;
                // Flag the active suggestion with a class
                //   if (index === activeSuggestion) {
                //     className = "suggestion-active";
                //   }

                return (
                  <li
                    className={className}
                    key={suggestion}
                    onMouseEnter={onHoverSelectable}
                    onClick={onClick}
                    onMouseLeave={onLeave}
                  >
                    {suggestion}
                  </li>
                );
              })}
            </ul>
          );
        } else {
          suggestionsListComponent = (
            <div className="no-suggestions">
              <em>No suggestions, you're on your own!</em>
            </div>
          );
        }
      }
    }

    return (
      <Fragment>
        <span
          style={{ fontSize: 34, cursor: "pointer" }}
          onMouseEnter={onChange}
          onMouseLeave={onLeave}
          onKeyDown={onKeyDown}
        >
          {this.state.userInput}
        </span>
        {this.state.mappingNumber}
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

export default Autocomplete;
