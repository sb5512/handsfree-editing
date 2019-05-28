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
      mappingNumber: this.props.mappingNumber,
      currentHoverText: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ showSuggestion: nextProps.showSuggestion });
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
      showSuggestion: true
    });
  };

  // onLeave = e => {
  //   this.setState({
  //     showSuggestion: false
  //   });
  // };

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
    console.log("Mouse entered");
    console.log(event.currentTarget.textContent);
    //this.setState({ currentHoverText: event.currentTarget.textContent });
    this.setState({
      userInput: event.currentTarget.textContent
    });
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
    console.log(
      "WHAT IS MY STATEEEEEEE FOR SHOWSUGGESTION",
      this.state.showSuggestion
    );
    console.log(
      "WHAT IS MY prosps sent FOR SHOWSUGGESTION",
      this.props.showSuggestion
    );
    if (this.state.showSuggestion) {
      // if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <ul className="suggestions">
          {this.props.suggestions.map((suggestion, index) => {
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
        {this.state.mappingNumber}
      </Fragment>
    );
  }
}

export default Autocomplete;
