import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { CSVLink } from "react-csv";

class ModalSession extends Component {
  handleClose = () => {
    this.props.startListening();
    // this.props.historyStates.history.goBack();
    this.props.sessionCounterUp();
    this.props.restartTimer();
  };

  componentWillMount() {
    this.props.stopListening();
  }

  render() {
    return (
      <div>
        <Modal show={true} onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title>End of Session</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You can now download the logdata, next session will begin
            immediately
          </Modal.Body>
          <Modal.Footer>
            {this.props.data.length > 1 ? (
              <CSVLink
                filename={this.props.filename}
                className="btn btn-primary float-right"
                target="_blank"
                onClick={this.handleClose}
                data={this.props.data}
                headers={[
                  { label: "Command", key: "command" },
                  { label: "Time", key: "time" },
                  { label: "Text", key: "textForLog" }
                ]}
              >
                Download log data
              </CSVLink>
            ) : (
              <div />
            )}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default ModalSession;
