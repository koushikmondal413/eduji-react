import React, { Component } from "react";

class Actions extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        //console.log(Object.keys(this.props.usersInClass).length);
        let endText;
        let endBackgColor;
        if (this.props.connectionStatus === 0) {
            endBackgColor = "grey";
            endText = "End";
        } else {
            endBackgColor = "";
            if (this.props.userType === "t") {
                endText = "End";
            } else {
                endText = "Leave";
            }
        }
        let syncButton;
        if (this.props.classRunning) {
            syncButton = (
                <button
                    style={{ margin: 0 }}
                    className="liteButton2"
                    style={{ backgroundColor: "#c7c7a9", borderRadius: 15 }}
                    onClick={this.props.handleSync}
                >
                    Sync
                </button>
            );
        } else {
            syncButton = "";
        }
        let actionBar1;
        let actionBarHeight;
        if (this.props.userType === "t") {
            actionBarHeight = 100;
            actionBar1 = (
                <div>
                    <div
                        style={{
                            width: 160,
                            display: "inline-block",
                            float: "left",
                            padding: "15px 5px",
                            textAlign: "left",
                        }}
                    >
                        <span style={{ color: "blue" }}>Users Connected : </span>
                        {!this.props.classRunning
                            ? this.props.usersConnected.length
                            : Object.keys(this.props.usersInClass).length}
                    </div>
                    <div
                        style={{
                            width: 150,
                            display: "inline-block",
                            float: "left",
                            padding: "15px 5px",
                            textAlign: "left",
                        }}
                    >
                        <label for="disableOthersWrite" style={{ color: "#778fe6", margin: 0 }}>
                            Disable Others{" "}
                        </label>
                        <input
                            checked
                            style={{ margin: 2 }}
                            type="checkbox"
                            id="disableOthersWrite"
                        />
                    </div>
                    <div
                        style={{
                            width: 120,
                            display: "inline-block",
                            float: "left",
                            padding: "14px 10px 5px",
                            textAlign: "left",
                        }}
                    >
                        {syncButton}
                    </div>
                    <div style={{ width: 180, display: "inline-block", marginRight: 15 }}>
                        {this.props.notification}
                    </div>
                    <div style={{ display: "inline-block", width: 70, textAlign: "left" }}>
                        {" "}
                        <span style={{ color: "#489a42", textShadow: "0 0 2px #83d4b6" }}>
                            Pages-{" "}
                        </span>
                        <label className="defaultLabel">{this.props.totalNofCanvases}</label>
                    </div>
                    <button
                        style={{ margin: 10 }}
                        className="logoutButton"
                        style={{ backgroundColor: endBackgColor }}
                        onClick={this.props.endSession}
                    >
                        {endText}
                    </button>
                    <button
                        style={{ margin: 10 }}
                        className="logoutButton"
                        onClick={this.props.handleLogoutClick}
                    >
                        Logout
                    </button>
                </div>
            );
        } else {
            actionBar1 = "";
            actionBarHeight = 50;
        }

        return (
            <div
                style={{
                    width: 945,
                    margin: "10px 10px 10px 98px",
                    textAlign: "right",
                    height: { actionBarHeight },
                }}
            >
                {actionBar1}
                <div>
                    <input
                        id="documentName"
                        style={{ width: 174 }}
                        type="text"
                        className="defaultInput"
                        value="Document1"
                    />
                    <button
                        style={{ margin: 10, background: "grey", color: "#fff" }}
                        className="liteButton2"
                        onClick={this.props.handleClearPage}
                    >
                        Clear
                    </button>
                    <label htmlFor="autoSave" className="defaultLabel ">
                        Auto save
                    </label>
                    <input
                        style={{ marginLeft: 2 }}
                        type="checkbox"
                        id="autoSave"
                        onClick={this.props.HandleAutoSave}
                    />
                    <button style={{ margin: 10, width: 30 }} className="liteButton2">
                        New
                    </button>
                    <div id="pageTitleDiv" style={{ display: "inline-block" }}>
                        <input
                            type="text"
                            className="defaultInput"
                            id={"pageTitle1"}
                            value={"Page 1"}
                            style={{ width: 106 }}
                        />
                    </div>
                    <button
                        style={{ margin: 10 }}
                        className="liteButton2"
                        onClick={this.props.handleSave}
                    >
                        Save
                    </button>
                    <button
                        style={{ margin: 10 }}
                        className="liteButton2"
                        onClick={this.props.handlePrevPage}
                    >
                        {"<<"} Prev Page
                    </button>
                    <div style={{ display: "inline-block", width: 30, textAlign: "center" }}>
                        {" "}
                        <label className="defaultLabel">:{this.props.currentPage}</label>
                    </div>

                    <button
                        style={{ margin: 10 }}
                        className="liteButton2"
                        onClick={this.props.handleNextPage}
                    >
                        Next Page {">>"}
                    </button>
                </div>
            </div>
        );
    }
}

export default Actions;
