import React, { Component } from "react";
import { useEffect, useRef, useState } from "react";
import "./draw.css";
import Chat from "./chat";

class Communication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addOthersDiv: "",
            audioEnabled: false,
            vidioEnabled: false,
            avDisabled: false,
        };
    }
    handleAddAnother = (e) => {
        //console.log(this.props.connectionStatus);
        if (this.props.connectionStatus !== 2) {
            this.props.handleConnectNow(e.target.value);
            this.props.handleRemoteDrawing(true);
        } else {
            this.props.handleAddAnotherPersion(e.target.value);
        }
        this.setState({ addOthersDiv: "" });
    };
    searchAddOthers = (e) => {
        let top = e.target.getBoundingClientRect().top + 40;
        let left = e.target.getBoundingClientRect().left - 20;
        let str = e.target.value;
        let studentsD = [];
        if (str === "") {
            this.setState({ addOthersDiv: "" });
            return;
        }
        if (this.props.userType === "t") {
            this.props.fetchStudents(this.props.sid).then((students) => {
                for (var i in students) {
                    let pattern = new RegExp(str, "i");
                    if (students[i].name.match(pattern)) {
                        //console.log(students[i]);
                        studentsD.push(
                            <div style={{ padding: 10, width: "80%" }}>
                                <div style={{ display: "inline-block", width: "70%" }}>
                                    <label htmlFor="">{students[i].name}</label>
                                </div>
                                <div style={{ display: "inline-block", width: "30%" }}>
                                    <button
                                        className="liteButton"
                                        value={students[i].email}
                                        onClick={this.handleAddAnother}
                                    >
                                        Connect
                                    </button>
                                </div>
                            </div>
                        );
                    }
                }
                let addOthersDiv = (
                    <div
                        style={{
                            width: "18%",
                            minHeight: 150,
                            maxHeight: 600,
                            position: "fixed",
                            top: top,
                            left: left,
                            background: "rgba(172, 212, 210, 0.38)",
                            boxShadow: "1px 1px 10px #ccc",
                            borderRadius: 4,
                            border: "1px solid #ccc",
                        }}
                    >
                        {studentsD}
                    </div>
                );
                this.setState({ addOthersDiv });
            });
        }
    };
    handleAudioToggle = () => {
        if (this.state.avDisabled) {
            alert("Audio and Video is unavailable for this session!");
            return;
        }
        if (this.state.audioEnabled) {
            this.setState({ audioEnabled: false });
            this.setState({ avDisabled: true });
            this.props.handleAudioDisconnect();
        } else {
            this.setState({ audioEnabled: true });
            this.props.handleAudioConnect();
        }
    };
    handleVideoToggle = () => {
        if (this.state.avDisabled) {
            alert("Audio and Video is unavailable for this session!");
            return;
        }
        if (this.state.vidioEnabled) {
            this.setState({ vidioEnabled: false });
            this.setState({ avDisabled: true });
            this.props.handleVideoDisconnect();
        } else {
            this.setState({ vidioEnabled: true });
            this.props.handleVideoConnect();
        }
    };
    render() {
        let leaveButton;
        let raiseHand;
        if (this.props.classRunning) {
            leaveButton = (
                <button
                    style={{ margin: 10 }}
                    className="logoutButton"
                    onClick={this.props.endSession}
                >
                    Leave
                </button>
            );
            if (this.props.userType === "s") {
                raiseHand = (
                    <div className="raiseHand">
                        <img
                            id="raiseHand"
                            style={{ border: "none", cursor: "pointer" }}
                            src={require("../../images/hand.png")}
                            alt="Raise Hand"
                            onClick={this.props.raiseHand}
                        />
                        <p>Raise Hand</p>
                    </div>
                );
            }
        } else {
            leaveButton = "";
            raiseHand = "";
        }
        let chat;
        if (this.props.connectionStatus === 2) {
            chat = (
                <Chat
                    name={this.props.name}
                    socket={this.props.socket}
                    connectionStatus={this.props.connectionStatus}
                    usersConnected={this.props.usersConnected}
                    usersInClass={this.props.usersInClass}
                    roomName={this.props.roomName}
                />
            );
        } else {
            chat = "";
        }
        let muteButtons;
        if (this.props.userType === "t" && this.props.classRunning) {
            muteButtons = (
                <div style={{ margin: 10, width: 248 }}>
                    <button
                        style={{ margin: 3 }}
                        className="defaultButton1"
                        onClick={this.props.onMuteAll}
                    >
                        Mute All
                    </button>
                    <button
                        style={{ margin: 3 }}
                        className="defaultButton1"
                        onClick={this.props.onUnmuteAll}
                    >
                        Unmute All
                    </button>
                </div>
            );
        } else if (this.props.userType === "s") {
            muteButtons = (
                <div style={{ width: 268 }}>
                    {leaveButton}
                    <button
                        style={{ margin: 10 }}
                        className="logoutButton"
                        onClick={this.props.handleLogoutClick}
                    >
                        Logout
                    </button>
                </div>
            );
        }

        return (
            <>
                {raiseHand}
                <div className="communicationDiv">
                    {muteButtons}
                    <div className="videoDiv">
                        <div
                            style={{ maxHeight: 600, overflow: "auto", minHeight: 300, width: 268 }}
                            id="videoDiv"
                        ></div>
                    </div>
                    {chat}
                </div>
                <audio id="handnotif" src={require("../../handnotif.mp3")}></audio>
            </>
        );
    }
}

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", (stream) => {
            console.log("stream :", stream);
            let video = document.getElementById(`video${props.index}`);
            video.srcObject = stream;
            video.play();
        });
    }, []);

    return <video id={"video" + props.index} width="200" height="180" autoPlay></video>;
};

export default Communication;
