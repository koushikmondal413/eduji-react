import React, { Component } from "react";
import "./login.css";
import { Link } from "react-router-dom";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { sentOtp: false, email: "", otpTryCount: 0 };
    }
    enterOtp = () => {
        let enterOtpB = document.getElementById("enterOtp");
        let email = document.getElementById("email");
        if (email.value === "") {
            alert("Please Enter Email.");
            email.focus();
            enterOtpB.removeAttribute("disabled");
            return;
        }
        this.setState({ email: email.value });
        this.setState({ sentOtp: true });
    };
    handleForgotPassword = (e) => {
        e.preventDefault();
        let sendOtpB = document.getElementById("sendOtp");
        sendOtpB.setAttribute("disabled", true);
        let email = document.getElementById("email");
        if (email.value === "") {
            alert("Please Enter Email.");
            email.focus();
            sendOtpB.removeAttribute("disabled");
            return;
        }
        //console.log(email);
        let token = localStorage.getItem("token");
        fetch(`/user/forgotpassword/${email.value}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({ email: email.value });
                this.setState({ sentOtp: true });
                alert("A password reset mail containing an OTP has been sent to your email id.");
            });
    };
    handleResetPassword = (e) => {
        e.preventDefault();
        let resetPasswordB = document.getElementById("resetPassword");
        resetPasswordB.setAttribute("disabled", true);
        let otp = document.getElementById("otp");
        let password = document.getElementById("password");
        let confpassword = document.getElementById("confpassword");
        if (otp.value.length !== 4) {
            alert("Invalid OTP.");
            otp.focus();
            resetPasswordB.removeAttribute("disabled");
            return;
        }
        if (password.value.length < 6) {
            alert("Password should be atleast 6 characters long.");
            password.focus();
            resetPasswordB.removeAttribute("disabled");
            return;
        }
        if (password.value !== confpassword.value) {
            alert("Passwords does not match.");
            confpassword.focus();
            resetPasswordB.removeAttribute("disabled");
            return;
        }
        //console.log(this.state.email);
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                otp: otp.value,
                email: this.state.email,
                password: password.value,
            }),
        };
        fetch("/user/forgotpasswordreset", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "reset done") {
                    alert("Password reset successful!");
                    window.location.href = "/login";
                } else {
                    alert("Invalid OTP!");
                    let otpTryCount = this.state.otpTryCount;
                    if (otpTryCount >= 3) {
                        window.location.reload();
                    }
                    otpTryCount = otpTryCount + 1;
                    this.setState({ otpTryCount });
                    resetPasswordB.removeAttribute("disabled");
                }
            });
    };

    render() {
        let pageBody;
        if (this.state.sentOtp) {
            pageBody = (
                <div className="loginDiv" style={{ margin: "9.3% -2% 8.2% 14%" }}>
                    <form action="/login" method="post" onSubmit={this.handleResetPassword}>
                        <table className="loginTable" style={{ margin: "6% 9%", width: "82%" }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <label className="defaultLabel" htmlFor="otp">
                                            OTP
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            className="defaultInput"
                                            type="text"
                                            name="otp"
                                            id="otp"
                                            style={{ width: 120 }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className="defaultLabel" htmlFor="password">
                                            New Password
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            className="defaultInput"
                                            type="password"
                                            name="password"
                                            id="password"
                                            style={{}}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className="defaultLabel" htmlFor="confpassword">
                                            Confirm Password
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            className="defaultInput"
                                            type="password"
                                            name="confpassword"
                                            id="confpassword"
                                            style={{}}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>
                                        <button
                                            type="submit"
                                            style={{ marginLeft: 60, width: 160, marginBottom: 20 }}
                                            className="loginButton"
                                            id="resetPassword"
                                        >
                                            Reset Password
                                        </button>
                                        <button
                                            type="button"
                                            style={{ marginLeft: 60, width: 180 }}
                                            className="loginButton"
                                            id="otpNotRecieved"
                                            onClick={() => {
                                                this.setState({ sentOtp: false });
                                            }}
                                        >
                                            OTP Not Received?
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            );
        } else {
            pageBody = (
                <div className="loginDiv" style={{ margin: "13.6% -2% 15.3% 16%" }}>
                    <form action="/login" method="post" onSubmit={this.handleForgotPassword}>
                        <table className="loginTable" style={{ marginLeft: "20%" }}>
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
                                            style={{ width: 232 }}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>
                                        <button
                                            type="submit"
                                            style={{ marginLeft: 10, width: 120 }}
                                            className="loginButton"
                                            id="sendOtp"
                                        >
                                            Send OTP
                                        </button>
                                        <button
                                            type="button"
                                            style={{ marginLeft: 20, width: 120 }}
                                            className="loginButton"
                                            id="enterOtp"
                                            onClick={this.enterOtp}
                                        >
                                            Enter OTP
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            );
        }
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
                    <div className="headerElement2">Signup</div>
                </Link>
                <Link
                    to="/login"
                    style={{
                        float: "right",
                        margin: "1% 2%",
                        fontSize: 16,
                        fontWeight: 600,
                        display: "block",
                    }}
                >
                    <div style={{ marginRight: -40 }} className="headerElement2">
                        Login
                    </div>
                </Link>

                {pageBody}
            </div>
        );
    }
}

export default ForgotPassword;
