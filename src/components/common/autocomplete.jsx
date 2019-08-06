import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { ButtonGroup, Button } from "react-bootstrap";
import Utils from "../../utils/Utils";

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
      currentHoverText: "",
      suggestions: []
    };
  }

  componentDidMount() {
    // fetch(`https://api.datamuse.com//words?sl=${this.state.userInput}&max=5`)
    //   .then(res => res.json())
    //   .then(data => {
    //     let answer = data.map(el => el.word);
    //     console.log("Fetched information are: ", data);
    //     this.props.setSuggestionList(this.state.userInput, answer);
    //     this.setState({ suggestions: answer });
    //   })
    //   .catch(this.setState({ suggestions: ["Loading..."] }));
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
    // if (!this.props.selectMode) {
    //   this.setState({
    //     activeSuggestion: 0,
    //     filteredSuggestions: [],
    //     showSuggestion: false,
    //     userInput: e.currentTarget.innerText[0]
    //   });
    // }
    let textReplaceFromSuggestion = Utils.removeLastWordSeperateBylineIfpresent(
      e.currentTarget.innerText
    );
    this.setState({
      userInput: textReplaceFromSuggestion //e.currentTarget.innerText
    });
  };

  onHoverSelectable = event => {
    // this.setState({
    //   userInput: event.currentTarget.innerText.split(" ")[0]
    // });
  };

  // After this is for trying the modal bootstrap

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  render() {
    const { onClick, onHoverSelectable } = this;

    let suggestionsListComponent;
    if (this.state.showSuggestion) {
      suggestionsListComponent = (
        <div className="d-flex flex-column">
          <ButtonGroup size="lg">
            {this.props.suggestions.map((suggestion, index) => {
              let className; // ??? maybe some css setup
              return (
                <Button
                  className={className}
                  key={suggestion}
                  onMouseEnter={onHoverSelectable}
                  onClick={onClick}
                >
                  <div className="p-3 mb-2 bg-secondary text-white">
                    {suggestion}
                    <div className="float-right text-warning">
                      {String.fromCharCode(97 + index)}
                    </div>
                  </div>
                </Button>
              );
            })}
            <Button>
              <div className="p-3 mb-2 bg-secondary text-warning">
                spell , lowercase, delete
              </div>
            </Button>
          </ButtonGroup>
        </div>
      );
    } else {
      suggestionsListComponent = <span />;
    }

    return (
      <>
        {" "}
        <Fragment>
          <span
            style={{
              fontSize: 34,
              cursor: "pointer",
              paddingLeft: 20
            }}
          >
            {this.state.showSuggestion ? (
              <span style={{ color: "blue" }}>{this.state.userInput}</span>
            ) : (
              this.state.userInput
            )}
          </span>
          {this.state.showSuggestion ? (
            <span style={{ color: "blue" }}>{this.state.indexing + 1}</span>
          ) : (
            this.state.indexing + 1
          )}

          <span
            style={{
              fontSize: 34,
              cursor: "pointer",
              paddingLeft: 20
            }}
          >
            {suggestionsListComponent}
          </span>
        </Fragment>
      </>
    );
  }
}

export default Autocomplete;
