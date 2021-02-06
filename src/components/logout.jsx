import React, { Component } from "react";

class Logout extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const logoutButton = {
      width: "60px",
      height: "30px",
      background: "red",
      border: "1px solid darkgrey",
      boxShadow: "1px 1px 5px #ccc",
      cursor: "pointer",
      borderRadius: "4px",
      fontSize: "16px",
      fontWeight: 500,
    };
    return (
      <div style={{}}>
        <button style={logoutButton} onClick={this.props.handleLogoutClick}>
          Logout
        </button>
      </div>
    );
  }
}

export default Logout;
