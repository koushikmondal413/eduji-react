import React, { Component } from "react";

class EmailNotVerified extends Component {
  state = {};
  render() {
    let signupSuccessMessage;
    if (this.props.signupSuccess) {
      signupSuccessMessage = "Successfully signed up.";
    } else {
      signupSuccessMessage = "";
    }
    return (
      <div
        style={{
          width: 400,
          height: 200,
          borderRadius: 8,
          backgroundColor: "#ccc",
          margin: "15% 34%",
          padding: 40,
        }}
      >
        <h3>{signupSuccessMessage}</h3>
        <h3>Please verify your email to continue.</h3>
        <p>Login to your email and click on the link to verify.</p>
      </div>
    );
  }
}

export default EmailNotVerified;
