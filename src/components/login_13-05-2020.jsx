import React, { Component } from "react";
import "./login.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    this.props.handleLogin({ email: email, password: password });
  }
  render() {
    if (this.props.signupSuccess) {
      alert("Successfully signed up.");
    }
    return (
      <div className="loginPage">
        <div className="imageDiv">
          <img
            src={require("../images/unnamed.jpg")}
            style={{ width: "100%", height: "-webkit-fill-available" }}
            alt=""
          />
        </div>
        <div className="loginDiv">
          <form action="/login" method="post" onSubmit={this.handleLogin}>
            <table className="loginTable">
              <tbody>
                <tr>
                  <td>
                    <label className="defaultLabel" htmlFor="email">
                      Email
                    </label>
                  </td>
                  <td>
                    <input
                      className="defaultInput"
                      type="text"
                      name="email"
                      id="email"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label className="defaultLabel" htmlFor="password">
                      Password
                    </label>
                  </td>
                  <td>
                    <input
                      className="defaultInput"
                      type="password"
                      name="password"
                      id="password"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    <button
                      type="submit"
                      style={{ marginLeft: "112px" }}
                      className="loginButton"
                    >
                      Login
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
