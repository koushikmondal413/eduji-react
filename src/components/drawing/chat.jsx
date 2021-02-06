import React, { Component } from "react";
import { useEffect, useRef, useState } from "react";
import "./chat.css";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = { keyPressed: "", listening: false };
        this.handleSendText = this.handleSendText.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.appendMessageToMessagebox = this.appendMessageToMessagebox.bind(this);
        this.listenToSocket = this.listenToSocket.bind(this);
    }
    componentDidMount() {
        if (this.props.connectionStatus === 2) {
            //alert("connection status: " + this.props.connectionStatus);
            let socket = this.props.socket;
            if (socket !== "") this.listenToSocket(socket);
        }
    }
    componentDidUpdate(prevProps) {
        //if (prevProps.connectionStatus !== this.props.connectionStatus)
        if (this.props.connectionStatus === 2 && !this.state.listening) {
            let socket = this.props.socket;
            if (socket !== "") this.listenToSocket(socket);
        }
    }
    listenToSocket(socket) {
        this.setState({ listening: true });
        socket.on("new message", (data) => {
            console.log("new message", data);
            this.appendMessageToMessagebox(data.message, data.senderName);
        });
    }
    sendMessage(message) {
        //console.log("message", message);
        //console.log("name", this.props.name);
        //console.log("socket", this.props.socket);
        let socket = this.props.socket;
        if (socket === "") {
            return;
        }
        socket.emit("send message", {
            message: message,
            senderName: this.props.name,
            roomName: this.props.roomName,
        });
    }
    appendMessageToMessagebox(message, senderName) {
        let messageE = document.getElementById("message");
        let messagebox = document.getElementById("messagebox");
        let messageC = document.createElement("div");
        let message1 = document.createElement("div");
        let sender = document.createElement("div");
        messageC.style.width = "auto";
        messageC.style.minWidth = "120px";
        messageC.style.height = "auto";
        messageC.style.margin = "6px";
        if (senderName === "me") {
            messageC.style.float = "right";
        } else {
            messageC.style.float = "left";
        }
        sender.style.width = "20px";
        sender.style.height = "20px";
        //sender.style.border = "1px solid #ccc";
        sender.style.borderRadius = "2em";
        sender.style.display = "inline-block";
        sender.style.fontSize = "11px";
        sender.style.padding = "2px";
        sender.style.backgroundColor = "cadetblue";
        sender.style.color = "#fff";
        if (senderName === "me") {
            sender.textContent = "Me";
        } else {
            let name = senderName.split(" ");
            name = name[0].split("");
            sender.textContent = name[0];
        }
        message1.style.backgroundColor = "#ccc";
        message1.style.minHeight = "14px";
        message1.style.minWidth = "80px";
        message1.style.borderRadius = "3px";
        message1.style.margin = "6px";
        message1.style.padding = "6px";
        if (senderName === "me") {
            message1.style.float = "left";
        } else {
            message1.style.float = "right";
        }
        message1.style.display = "block";
        message1.style.maxWidth = "200px";
        message1.style.overflow = "auto";

        //message1.setAttribute = ("style", "background-color:#ccc; min-height:14px; width:60px;border-radius:3px");
        message1.textContent = message;
        messageC.append(message1);
        messageC.append(sender);
        messagebox.appendChild(messageC);
        //console.log(<Message message={message} />);

        messagebox.scrollTop = messagebox.scrollHeight;
        if (senderName === "me") {
            messageE.value = "";
            messageE.focus();
        }
    }
    handleSendText(e) {
        if (
            this.props.usersConnected.length < 2 &&
            Object.keys(this.props.usersInClass).length < 2
        ) {
            alert("Please connect with atleast 1 person!");
            return;
        }
        let messageE = document.getElementById("message");
        let message = messageE.value;
        this.appendMessageToMessagebox(message, "me");
        this.sendMessage(message);
    }
    minimizeChat = () => {
        let chatbox = document.getElementById("chatbox");
        if (chatbox.style.height === "22px") {
            chatbox.style.height = "358px";
        } else {
            chatbox.style.height = "22px";
        }
    };
    render() {
        //console.log(this.props.usersConnected);
        return (
            <div className="chatbox" id="chatbox">
                <span style={{ float: "left", marginLeft: 10 }}>Chat</span>
                <span
                    style={{ float: "right", marginRight: 15, cursor: "pointer" }}
                    onClick={this.minimizeChat}
                >
                    <img src={require("../../images/minus.png")} alt="Minimize" />
                </span>
                <div className="messagebox" id="messagebox"></div>
                <div className="typingbox">
                    <textarea
                        style={{
                            minWidth: 255,
                            borderRadius: 4,
                            minHeight: 60,
                            maxHeight: 60,
                            maxWidth: 255,
                        }}
                        name="message"
                        id="message"
                        cols="33"
                        rows="3"
                        onKeyDown={(e) => {
                            console.log(e.key);
                            if (this.state.keyPressed === "Shift" && e.key === "Enter") {
                                e.preventDefault();
                                this.handleSendText();
                            }
                            this.setState({ keyPressed: e.key });
                        }}
                        onKeyUp={() => {
                            this.setState({ keyPressed: "" });
                        }}
                    ></textarea>
                    <label htmlFor="sendChat">Shift + Enter</label>
                    <button
                        id="sendChat"
                        style={{ minHeight: 14, float: "right", marginRight: 6 }}
                        className="liteButton"
                        onClick={this.handleSendText}
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }
}

const Message = (props) => {
    useEffect(() => {
        console.log(this.props.message);
    }, []);

    return <div className="message">{this.props.message}</div>;
};

export default Chat;
