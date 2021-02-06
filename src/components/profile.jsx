import React, { Component } from "react";
import "./notes.css";
import { withRouter } from "react-router-dom";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            changePasswodDivOn: false,
        };
    }
    componentDidMount() {
        this.getProfileInformation();
    }
    handleBack = () => {
        this.props.history.goBack();
    };
    changePasswodToggel = () => {
        if (this.state.changePasswodDivOn) {
            this.setState({ changePasswodDivOn: false });
        } else {
            this.setState({ changePasswodDivOn: true });
        }
    };
    getProfileInformation() {
        let sid = this.props.sid;
        if (sid === "") {
            setTimeout(() => {
                this.getProfileInformation(sid);
            }, 200);
        }
        let token = localStorage.getItem("token");
        fetch(`/api/profile/${sid}/getprofileinfo`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                this.setState({ name: data.name });
                this.setState({ email: data.email });
            });
    }
    changePassword = () => {
        let saveNewPasswordB = document.getElementById("saveNewPassword");
        saveNewPasswordB.setAttribute("disabled", "true");
        let oldPassword = document.getElementById("oldPassword");
        let password = document.getElementById("newPassword");
        let rePassword = document.getElementById("reNewPassword");
        if (oldPassword.value === "") {
            alert("Please enter old password!");
            saveNewPasswordB.removeAttribute("disabled");
            oldPassword.focus();
            return;
        }
        if (password.value === "") {
            alert("Please enter new password!");
            saveNewPasswordB.removeAttribute("disabled");
            password.focus();
            return;
        }
        if (password.value.length < 6) {
            alert("Please enter password of length greater than 6 characters!");
            saveNewPasswordB.removeAttribute("disabled");
            password.focus();
            return;
        }
        if (rePassword.value === "") {
            alert("Please re enter new password!");
            saveNewPasswordB.removeAttribute("disabled");
            rePassword.focus();
            return;
        }
        if (password.value !== rePassword.value) {
            alert("Password does not match!");
            saveNewPasswordB.removeAttribute("disabled");
            rePassword.focus();
            return;
        }
        let token = localStorage.getItem("token");
        fetch(
            `/api/profile/${this.props.sid}/changepassword/${oldPassword.value}/${password.value}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                if (data.status === "updated") {
                    alert("Password changed successfully!");
                } else if (data.status === "incorrect password") {
                    alert("Incorrct password.");
                    saveNewPasswordB.removeAttribute("disabled");
                }
            });
    };
    render() {
        let changePasswodDiv;
        if (this.state.changePasswodDivOn) {
            changePasswodDiv = (
                <div
                    style={{
                        margin: 20,
                        border: "1px solid green",
                        width: 324,
                        padding: "10px 52px",
                        verticalAlign: "top",
                        display: "inline-block",
                        boxShadow: "0px 0px 5px",
                        borderRadius: 4,
                    }}
                >
                    <label style={{ color: "rgb(191, 190, 171)" }} htmlFor="oldPassword">
                        Old Password
                    </label>
                    <br />
                    <input
                        style={{ marginBottom: 5, boxShadow: "1px 1px 5px #544d4d" }}
                        type="password"
                        id="oldPassword"
                        className="defaultInput"
                        placeholder="********"
                    />
                    <br />
                    <label style={{ color: "rgb(191, 190, 171)" }} htmlFor="newPassword">
                        New Password
                    </label>
                    <br />
                    <input
                        style={{ boxShadow: "1px 1px 5px #544d4d", marginBottom: 5 }}
                        type="password"
                        id="newPassword"
                        className="defaultInput"
                        placeholder="********"
                    />
                    <br />
                    <label style={{ color: "rgb(191, 190, 171)" }} htmlFor="reNewPassword">
                        Retype New Password
                    </label>
                    <br />
                    <input
                        style={{ boxShadow: "1px 1px 5px #544d4d" }}
                        type="password"
                        id="reNewPassword"
                        className="defaultInput"
                        placeholder="********"
                    />
                    <button
                        style={{ margin: "14px 24px" }}
                        className="liteButton"
                        onClick={this.changePasswod}
                        id="saveNewPassword"
                    >
                        Save
                    </button>
                </div>
            );
        }
        return (
            <div>
                <div className="pageHeader2" style={{ height: 58, paddingLeft: 0 }}>
                    <p
                        style={{ float: "left", margin: 10, cursor: "pointer" }}
                        onClick={this.handleBack}
                    >
                        <img src={require("../images/back.png")} alt="" />
                    </p>
                    <h1 className="heading1">Profile</h1>
                </div>
                <div className="pageBody1">
                    <div className="previewDiv">
                        <h4>Image</h4>
                        <div className="imageDiv" id="imageDiv">
                            <img
                                id="profileImage"
                                width="240"
                                height="240"
                                src={require("../images/default-profile-image.png")}
                                alt=""
                            />
                        </div>
                        <div style={{ verticalAlign: "middle", display: "none" }}>
                            <input
                                style={{ display: "inline" }}
                                class="defaultInput"
                                type="file"
                                name="profileImage"
                                id="profileImage"
                            />
                            <button style={{ margin: 10, height: 34 }} className="liteButton">
                                Upload
                            </button>
                        </div>
                    </div>
                    <div className="listView" style={{ textAlign: "left", paddingLeft: 40 }}>
                        <h3>Name</h3>
                        <p>{this.state.name}</p>
                        <h3>Email</h3>
                        <p>{this.state.email}</p>
                        <button
                            style={{ margin: "20px 60px" }}
                            className="liteButton"
                            onClick={this.changePasswodToggel}
                        >
                            Change Password
                        </button>
                        {changePasswodDiv}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Profile);
