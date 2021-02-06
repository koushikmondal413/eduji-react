import React, { Component } from "react";
import { Link } from "react-router-dom";

class Signup extends Component {
    constructor(props) {
        super(props);

        this.handleSignup = this.handleSignup.bind(this);
    }
    validateEmail(x) {
        if (x === "") {
            alert("Email cannot be empty.");
            return false;
        }
        var atposition = x.indexOf("@");
        var dotposition = x.lastIndexOf(".");
        if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= x.length) {
            alert("Please enter a valid e-mail address.");
            return false;
        }
        return true;
    }
    checkPassword(pass1, pass2) {
        if (pass1.length < 6) {
            alert("Password must be atleast 6 characters.");
            return false;
        }
        if (pass1 === "") {
            alert("Password cannot be empty.");
            return false;
        }
        if (pass1 !== pass2) {
            alert("Password does not match.");
            return false;
        }
        return true;
    }

    handleSignup(e) {
        e.preventDefault();
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let usertype = document.signup.usertype.value;
        let password = document.getElementById("password").value;
        let confirm_password = document.getElementById("confirm_password").value;
        if (name === "") {
            alert("Name cannot be empty.");
            document.getElementById("name").focus();
            return false;
        }
        if (!this.validateEmail(email)) {
            document.getElementById("email").focus();
            return false;
        }
        if (usertype === "") {
            alert("Please select who you are.");
            document.getElementById("usertypes").focus();
            return false;
        }
        if (!this.checkPassword(password, confirm_password)) {
            //alert("Passwords do not match.");
            document.getElementById("confirm_password").focus();
            return false;
        }

        if (usertype === "s") {
            usertype = 1;
        }
        if (usertype === "t") {
            usertype = 5;
        }
        //console.log("s2");
        this.props.handleSignup({
            name: name,
            email: email,
            usertype: usertype,
            password: password,
        });
    }

    render() {
        if (this.props.signupFailed) {
            alert(this.props.signupFailedMessage);
        }
        return (
            <div className="loginPage">
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
                    <div className="headerElement3">Login</div>
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
                <div className="loginDiv" style={{ margin: "3% 24% 6% 24%" }}>
                    <form name="signup" onSubmit={this.handleSignup}>
                        <table className="signupTable">
                            <tbody>
                                <tr>
                                    <td>
                                        <label className="defaultLabel" htmlFor="email">
                                            Full Name
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            className="defaultInput"
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Name"
                                        />
                                    </td>
                                </tr>
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
                                            placeholder="Email"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className="defaultLabel" htmlFor="email">
                                            Are You?
                                        </label>
                                    </td>
                                    <td style={{}}>
                                        <div style={{ padding: "0px 10px" }}>
                                            <input
                                                style={{ width: 15, height: 15 }}
                                                type="radio"
                                                name="usertype"
                                                id="usertypet"
                                                value="t"
                                            />
                                            <label
                                                style={{
                                                    color: "green",
                                                    padding: "10px",
                                                    fontSize: 15,
                                                }}
                                                htmlFor="usertypet"
                                            >
                                                Teacher
                                            </label>
                                        </div>
                                        <div style={{ padding: "0px 10px" }}>
                                            <input
                                                style={{ width: 15, height: 15 }}
                                                type="radio"
                                                name="usertype"
                                                id="usertypes"
                                                value="s"
                                            />
                                            <label
                                                style={{
                                                    color: "green",
                                                    padding: "10px",
                                                    fontSize: 15,
                                                }}
                                                htmlFor="usertypes"
                                            >
                                                Student
                                            </label>
                                        </div>
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
                                            placeholder="******"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className="defaultLabel" htmlFor="confirm_password">
                                            Confirm Password
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            className="defaultInput"
                                            type="password"
                                            name="confirm_password"
                                            id="confirm_password"
                                            placeholder="******"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>
                                        <button
                                            type="submit"
                                            style={{ marginLeft: "112px", width: 70 }}
                                            className="loginButton"
                                            id="signupButton"
                                        >
                                            Signup
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

export default Signup;
