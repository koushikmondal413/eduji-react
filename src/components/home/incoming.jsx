import React, { Component } from "react";
import io from "socket.io-client";

class Incoming extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        style={{
          width: 300,
          border: "1px solid #b7b7ce",
          borderRadius: 8,
          position: "fixed",
          top: 0,
          right: 0,
          margin: "120px 20px",
          height: 100,
          zIndex: 10,
          boxShadow: "1px 1px 6px #ccc",
          color: "coral",
        }}
      >
        <div style={{ height: "40%" }}>Incoming</div>

        <div>
          <div style={{ display: "inline-block", width: "70%" }}>
            {this.props.incomingFrom}
          </div>
          <div style={{ display: "inline-block", width: "30%" }}>
            <button
              className="defaultButton"
              value={this.props.sid}
              onClick={this.props.handleConnect}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Incoming;
