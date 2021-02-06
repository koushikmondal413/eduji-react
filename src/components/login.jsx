import React, { Component } from "react";
import "./login.css";
import { Link } from "react-router-dom";

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
        return (
            <div className="loginPage">
                <Link
                    to="/signup"
                    style={{
                        float: "right",
                        margin: "1% 2%",
                        fontSize: 16,
                        fontWeight: 600,
                        display: "block",
                    }}
                >
                    <div className="headerElement3">Signup</div>
                </Link>
                <Link
                    to="/about"
                    style={{
                        float: "right",
                        margin: "1% 2%",
                        fontSize: 16,
                        fontWeight: 600,
                        display: "block",
                    }}
                >
                    <div className="headerElement3" style={{ marginRight: -42 }}>
                        About
                    </div>
                </Link>
                <div className="loginDiv" style={{ margin: "12% 0px 12% 18%" }}>
                    <form action="/login" method="post" onSubmit={this.handleLogin}>
                        <table className="loginTable">
                            <tbody>
                                <tr>
                                    <td>
                                        <label className="defaultLabel1" htmlFor="email">
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
                                        <label className="defaultLabel1" htmlFor="password">
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
                                            style={{ marginLeft: 120 }}
                                            className="loginButton"
                                        >
                                            Login
                                        </button>
                                        <button
                                            type="button"
                                            style={{ marginLeft: 20, width: 140 }}
                                            className="loginButton"
                                            onClick={() => {
                                                window.location.href = "/forgotpassword";
                                            }}
                                        >
                                            Forgot Password
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
