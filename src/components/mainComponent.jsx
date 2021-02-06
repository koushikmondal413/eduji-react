import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Home from "./home";
import DrawPage from "./drawPage";
import jwtDecode from "jwt-decode";
import io from "socket.io-client";
import { useHistory } from "react-router-dom";
import Peer from "simple-peer";
import Notes from "./notes";
import Peer1 from "../peer1";
import Profile from "./profile";
import Loading from "./loading";
import EmailNotVerified from "./emailNotVerified";
import ForgotPassword from "./forgotPassword";
import About from "./about";
var kurentoUtils = require("kurento-utils");

class MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: 0,
            signupSuccess: false,
            signupFailed: false,
            signupFailedMessage: "",
            userType: "",
            name: "",
            sid: "",
            connectionStatus: 0,
            incoming: true,
            connectId: "",
            incomingFrom: "",
            peerInitiator: false,
            isDrawing: false,
            remoteX: 0,
            remoteY: 0,
            teachers: [],
            students: [],
            noOfUsersConnected: 2,
            selectedCanvas: 1,
            totalNoOfCanvases: 1,
            notes: "",
            peers: [],
            socket: "",
            usersConnected: [],
            peer: "",
            classRunning: false,
            roomName: "",
            pageActionAllowed: true,
            confAudioOrVideo: "audio",
            usersInClass: [],
            mySocketId: "",
            previousReqCompleted: false,
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleConnectNow = this.handleConnectNow.bind(this);
        this.endSession = this.endSession.bind(this);
        this.handleConnect = this.handleConnect.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleDraw = this.handleDraw.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.handleStart1 = this.handleStart1.bind(this);
        this.handleDraw1 = this.handleDraw1.bind(this);
        this.handleStop1 = this.handleStop1.bind(this);
        this.handleAddAnotherPersion = this.handleAddAnotherPersion.bind(this);
        this.handlePages = this.handlePages.bind(this);
        this.fetchNotes = this.fetchNotes.bind(this);
        this.audioVideoConnection = this.audioVideoConnection.bind(this);
        this.onSocketConnect = this.onSocketConnect.bind(this);
        this.onVideoContainerHover = this.onVideoContainerHover.bind(this);
        this.onVideoContainerMouseOut = this.onVideoContainerMouseOut.bind(this);
        this.onSingleMute = this.onSingleMute.bind(this);
        this.onSingleAllow = this.onSingleAllow.bind(this);
        this.publishStatus = this.publishStatus.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.remoteErase = this.remoteErase.bind(this);
        this.onRaiseHand = this.onRaiseHand.bind(this);
        this.raiseHand = this.raiseHand.bind(this);
        this.handleOnScroll = this.handleOnScroll.bind(this);
    }
    validateLogin() {
        fetch(`/api/validate/login/${this.state.token}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                if (data.valid) {
                    if (this.state.loggedIn !== 2) this.setState({ loggedIn: 2 });
                } else {
                    if (this.state.loggedIn !== 1) this.setState({ loggedIn: 1 });
                    this.setState({ sid: "" });
                }
                this.setState({ previousReqCompleted: true });
            })
            .catch((e) => {
                this.setState({ loggedIn: 1 });
            });
    }
    async setUserDetails(token) {
        if (token) {
            this.setState({ token: token });
            try {
                let decodedToken = await jwtDecode(token);
                this.setState({ userType: decodedToken.user });
                this.setState({ sid: decodedToken._id });
                this.setState({ name: decodedToken.name });
                //this.fetchUsers();
                //this.fetchNotes();
            } catch (e) {
                console.log(e);
            }
        }
    }
    fetchUsers() {
        if (this.state.userType === "s") {
            this.fetchTeachers();
        }
        if (this.state.userType === "t") {
            this.fetchStudents();
        }
    }
    async componentDidMount() {
        let token = localStorage.getItem("token");
        await this.setUserDetails(token);

        this.validateLogin();

        var validate = setInterval(() => {
            if (this.state.loggedIn !== 2) return;
            if (!this.state.previousReqCompleted) return;
            this.setState({ previousReqCompleted: false });
            this.validateLogin();
        }, 30000);
        if (this.state.loggedIn === 1) {
            //clearInterval(validate);
        }
        //console.log(this.state.loggedIn);
        //this.checkForIncoming();
        if (typeof this.socket !== "undefined") {
        }
        /*const script = document.createElement("script");
        script.src = "../adapter.js";
        script.async = true;
        document.body.appendChild(script);
        const script1 = document.createElement("script");
        script1.src = "../kurento-utils.min.js";
        script1.async = true;
        document.body.appendChild(script1);*/
        if (this.state.userType === "s" && this.state.classRunning) {
            this.setState({ pageActionAllowed: false });
        }
        document.addEventListener("scroll", this.handleOnScroll);
    }
    componentDidUpdate() {
        if (this.state.userType === "s" && this.state.classRunning) {
            if (this.state.pageActionAllowed) this.setState({ pageActionAllowed: false });
        }
    }
    checkForIncoming() {
        if (this.state.loggedIn !== 2) {
            setTimeout(() => {
                this.checkForIncoming();
            }, 1000);
            return;
        }
        let token = localStorage.getItem("token");
        fetch(`/api/user/incoming/${this.state.sid}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                if (data.connectId) {
                    if (data.status === 0) {
                        if (data.initiator === 1) {
                            if (this.state.connectionStatus !== 3) {
                                this.setState({ connectionStatus: 3 });
                            }
                            if (!this.state.peerInitiator) {
                                this.setState({ peerInitiator: true });
                            }
                        } else {
                            this.setState({ connectionStatus: 1 });
                        }

                        this.setState({ connectId: data.connectId });
                    } else if (data.status === 1) {
                        if (this.state.connectionStatus !== 2) {
                            this.setState({ connectionStatus: 2 });
                        }
                    }
                    if (this.state.incomingFrom !== data.name) {
                        this.setState({ incomingFrom: data.name });
                    }
                } else {
                    if (this.state.connectionStatus !== 0) {
                        this.setState({ connectionStatus: 0 });
                    }
                }
                this.checkForIncoming();
            });
    }
    fetchTeachers(sid) {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            fetch(`/api/student/${sid}/teachers`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    //console.log(data.row1);
                    //this.setState({ teachers: data.row1 });
                    resolve(data.row1);
                });
        });
    }
    fetchStudents(sid) {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            fetch(`/api/teacher/${sid}/students`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    //console.log(data.row1);
                    //this.setState({ students: data.row1 });
                    resolve(data.row1);
                });
        });
    }
    handleLogin(user) {
        this.setState({ loggedIn: 4 });
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, password: user.password }),
        };
        fetch("/api/login", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                if (data.message === "login failed") {
                    alert("Incorrect Username or Password");
                    this.setState({ loggedIn: 1 });
                } else if (data.message === "email not verified") {
                    this.setState({ loggedIn: 3 });
                } else if (data.message === "login sucessful") {
                    localStorage.setItem("token", data.token);
                    this.setState({ loggedIn: 2 });
                    this.setState({ token: data.token });
                    this.setUserDetails(data.token);
                }
            });
    }
    handleSignup(user) {
        //console.log("sig");
        let signupButton = document.getElementById("signupButton");
        signupButton.setAttribute("disabled", "disabled");
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        };
        fetch("/api/signup", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data.message);
                if (data.message === "signup success") {
                    this.setState({ signupSuccess: true });
                    this.setState({ loggedIn: 3 });
                } else if (data.message === "user exist") {
                    this.setState({
                        signupFailed: true,
                        signupFailedMessage: "User already exist.",
                    });
                }
                signupButton.setAttribute("disabled", "false");
            });
    }
    handleLogoutClick() {
        localStorage.removeItem("token");
        this.setState({ userType: "" });
        this.setState({ loggedIn: 1 });
        fetch(`/api/logout/${this.state.token}`).then((response) => {
            //console.log(data);
            alert("Logout Successful!");
            window.location.reload();
        });
    }
    async handleConnectNow(email) {
        let token = localStorage.getItem("token");
        let response = await fetch(`/api/user/${this.state.sid}/connect/${email}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        let data = await response.json();
        //console.log(data.namespace);
        this.initiateConnect(data, email);
        this.setState({ connectId: data.namespace });
    }
    initiateConnect(data, email) {
        this.setState({ peerInitiator: true });
        let socket = io(`/${data.namespace}`);
        //setInterval(() => {
        socket.emit("connectNow", {
            message: `Initiating a connection`,
            sid: this.state.sid,
            email: email,
            namespace: data.namespace,
        });
        this.onSocketConnect(socket);
        //}, 10000);
        //this.handlePeerConnection(socket);
        this.socket = socket;
        this.setState({ socket });
    }
    handleConnect() {
        let socket = io(`/${this.state.connectId}`);
        //setInterval(() => {
        socket.emit("iAmConnected", {
            sid: this.state.sid,
        });
        //this.initiatePeerConnection(socket);
        socket.on("mousemove", (data) => {
            //console.log(data);
            //socket.broadcast.emit("mousemove", data);
        });
        //this.handlePeerConnection(socket);
        this.onSocketConnect(socket);
        this.socket = socket;
        this.setState({ socket });
    }
    onSocketConnect(socket) {
        socket.on("connected users", (data) => {
            //console.log("new user connected");
            //console.log("data", data);
            //this.initiatePeerConnection(socket);
            this.setState({ usersConnected: data });
        });
        socket.on("disconnect emited", (data) => {
            //console.log("dis", data);
            this.setState({ usersConnected: data });
        });
        socket.on("disconnect", (data) => {
            //console.log("dis", data);
            this.setState({ usersConnected: [] });
        });
        this.handleRemoteDrawing(socket);
        socket.on("audio video disconnect", () => {
            this.handleAudioDisconnect(true);
            this.handleVideoDisconnect(true);
        });
    }
    createPeer = (initiator, stream, trickle, socket) => {
        const peer = new Peer({
            initiator: initiator,
            stream: stream,
            trickle: trickle,
        });
        //console.log("initiator", initiator);
        peer.on("signal", (data) => {
            //console.log("signal", data);
            socket.emit("offer", data);
        });
        socket.on("answer", (data) => {
            //console.log("answer ", data);
            peer.signal(data);
        });
        return peer;
    };
    addPeer = (initiator, stream, trickle, socket) => {
        //console.log("initiator", initiator);
        const peer = new Peer({
            initiator: initiator,
            stream: stream,
            trickle: trickle,
        });
        socket.emit("get offer");
        socket.on("offer", (data) => {
            //console.log("pffer", data);
            peer.signal(data);
        });
        peer.on("signal", (data) => {
            //console.log("answer", data);
            socket.emit("answer", data);
        });

        return peer;
    };
    getPeerInitiator(namespace) {
        return new Promise((resolve, reject) => {
            fetch(`/api/getpeerinitiator/${namespace}`, {
                headers: { Authorization: `Bearer ${this.state.token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.peerInitiator);
                });
        });
    }
    audioVideoConnection(device) {
        if (this.state.usersConnected.length > 2) {
            alert("Currently video and audio is available for only two persons!");
            return;
        }
        let video;
        const videoConstraints = {
            height: 300,
            width: 300,
        };
        if (device === "audio") {
            video = false;
        } else {
            video = videoConstraints;
        }
        const userVideo = {};

        navigator.mediaDevices.getUserMedia({ video: video, audio: true }).then(async (stream) => {
            let peerInitiator = await this.getPeerInitiator(this.state.connectId);
            //console.log(stream);
            //console.log(this.state.peerInitiator);
            let peer;
            if (peerInitiator) {
                peer = this.createPeer(true, stream, false, this.socket);
            } else {
                peer = this.addPeer(false, stream, false, this.socket);
            }
            //console.log("this.state.peerInitiator", this.state.peerInitiator);
            peer.on("connect", () => {
                //console.log("connected");
            });
            peer.on("stream", (stream) => {
                if (device == "video") {
                    var video = document.createElement("video");
                    video.style.width = "100px";
                    document.getElementById("videoDiv").appendChild(video);
                    if ("srcObject" in video) {
                        video.srcObject = stream;
                    } else {
                        video.src = window.URL.createObjectURL(stream); // for older browsers
                    }
                    video.play();
                } else {
                    var audio = document.createElement("audio");
                    audio.style.width = "100px";
                    document.getElementById("videoDiv").appendChild(audio);
                    if ("srcObject" in audio) {
                        audio.srcObject = stream;
                    } else {
                        audio.src = window.URL.createObjectURL(stream); // for older browsers
                    }
                    audio.play();
                }
            });
            this.socket.on("audio disconnect", (data) => {
                var track = stream.getAudioTracks()[0]; // if only one media track
                // ...
                track.stop();
            });
            this.socket.on("video disconnect", (data) => {
                var track = stream.getVideoTracks()[0]; // if only one media track
                // ...
                track.stop();
                //this.state.peer.destroy();
            });
        });
    }

    handleAudioConnect = () => {
        this.audioVideoConnection("audio");
    };
    handleVideoConnect = () => {
        this.audioVideoConnection("video");
    };
    handleAudioDisconnect = (remote = false) => {
        if (!remote) {
            this.socket.emit("audio disconnect");
        }
        this.setState({ peer: "" });
        var audio = document.querySelector("audio");
        if (audio) audio.remove();
    };
    handleVideoDisconnect = (remote = false) => {
        if (!remote) {
            this.socket.emit("video disconnect");
        }
        this.setState({ peer: "" });
        var video = document.querySelector("video");
        if (video) video.remove();
        //this.state.peer.destroy();
    };

    handleAddAnotherPersion(email) {
        fetch(`/api/sendconnection/${this.state.sid}/email/${email}`, {
            headers: { Authorization: `Bearer ${this.state.token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                this.handlePeerConnection(this.socket);
            });
    }
    handleRemoteDrawing(socket) {
        socket.on("start", (data) => {
            //console.log("start", data);
            this.setState({ isDrawing: true });
            this.setState({ remoteX: data.x });
            this.setState({ remoteY: data.y });
            this.remoteDraw(data.x, data.y);
        });
        socket.on("draw", (data) => {
            //console.log("draw", data);
            this.setState({ remoteX: data.x });
            this.setState({ remoteY: data.y });

            this.remoteDraw(data.x, data.y);
        });
        socket.on("stop", (data) => {
            //console.log("stop", data);
            this.setState({ isDrawing: false });
            this.remoteStop();
        });
    }
    remoteDraw(x, y) {
        let canvas = document.getElementById(`canvas${this.state.selectedCanvas}`);
        if (canvas !== null) {
            let ctx = canvas.getContext("2d");
            this.canvas = canvas;
            this.ctx = ctx;

            let remoteC = document.getElementById("remoteC");
            let y1 = x + canvas.offsetLeft - window.scrollX;
            let x1 = y + canvas.offsetTop - window.scrollY;
            remoteC.style.top = x1 + "px";
            remoteC.style.left = y1 + "px";
            //console.log(window.scrollY);
            //console.log("canvas.offsetTop", canvas.offsetTop);
            //console.log(remoteC);
            if (this.state.remoteEraserSelected) {
                this.remoteErase(x, y);
                return;
            }
        }
        if (!this.state.isDrawing) return;
        //console.log(this.ctx);
        //if (typeof this.crx !== "undefined") {
        //console.log("rem", x);
        this.ctx.lineWidth = this.state.remoteStrokeSize;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(x, y);
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.strokeStyle = this.state.remoteStrokeColor;
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        //console.log(x, y);
        //}
    }
    remoteErase(x, y) {
        if (!this.state.isDrawing) return;
        this.ctx.lineWidth = this.state.remoteStrokeSize;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(x, y);
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.strokeStyle = "rgba(255,255,255,1)";
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        //console.log(x, y);
    }
    remoteStop() {
        this.ctx.beginPath();
    }
    initiatePeerConnection(socket) {
        var peer = new Peer({ initiator: true, data: this.mouseMove });
        peer.on("signal", (data) => {
            //alert(data);
            // when peer1 has signaling data, give it to peer2 somehow
            socket.emit("peer", data);
            socket.on("peer", (data) => {
                peer.signal(data);
                alert(data);
            });
        });
        peer.on("connect", () => {
            alert("CONNECT");
        });
    }
    handleStart(x, y) {
        //console.log(x, y);
        if (typeof this.socket !== "undefined") {
            //console.log(this.socket);
            this.socket.emit("start", { x: x, y: y });
        }
    }
    handleDraw(x, y) {
        //console.log("d", y);
        if (typeof this.socket !== "undefined") {
            this.socket.emit("draw", { x: x, y: y });
        }
    }
    handleStop() {
        if (typeof this.socket !== "undefined") {
            this.socket.emit("stop");
        }
    }
    handleStart1(x, y) {
        this.state.socket.emit("start", { x: x, y: y, roomName: this.roomName });
    }
    handleDraw1(x, y) {
        this.state.socket.emit("draw", { x: x, y: y, roomName: this.roomName });
    }
    handleStop1() {
        //console.log("stop1");
        this.state.socket.emit("stop", { roomName: this.roomName });
    }
    handlePages(selectedCanvas, totalNoOfCanvases) {
        this.setState({ selectedCanvas });
        this.setState({ totalNoOfCanvases });
    }
    endSession() {
        if (this.socket) {
            this.socket.emit("force disconnect");
        }
        this.setState({ onSession: false, connectionStatus: 0 });
        window.location.reload();
    }
    fetchNotes() {
        if (this.state.sid != "") {
            this.fetchAllNotes(this.state.sid);
        } else {
            setTimeout(() => {
                this.fetchNotes();
            }, 200);
        }
    }
    fetchAllNotes(sid) {
        fetch(`/api/notes/${sid}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                this.setState({ notes: data });
            });
    }
    /////////////////////
    // handlers functions
    receiveVideo(userid, username) {
        let divMeetingRoom = document.getElementById("videoDiv");
        if (this.state.confAudioOrVideo === "audio") {
            var video = document.createElement("audio");
        } else {
            var video = document.createElement("video");
        }
        var div = document.createElement("div");
        div.className = "videoContainer";
        div.id = "cont_" + userid;
        var name = document.createElement("div");
        name.className = "videoContainerName";
        video.id = userid;
        div.style.cursor = "pointer";
        if (this.state.userType === "t") {
            var hoverDiv = this.createVideoContHoverDiv(userid);
            var raiseHandDiv = this.createRaiseHandDiv(userid);
            div.append(raiseHandDiv);
            div.append(hoverDiv);
            div.addEventListener("mouseover", () => {
                this.onVideoContainerHover(userid);
            });
            div.addEventListener("mouseout", () => {
                this.onVideoContainerMouseOut(userid);
            });
        }
        video.autoplay = true;
        name.appendChild(document.createTextNode(username));
        if (this.state.confAudioOrVideo === "audio") {
            let div1 = document.createElement("div");
            div1.style.width = "20px";
            div1.style.height = "36px";
            div.appendChild(div1);
        }
        div.appendChild(video);
        div.appendChild(name);
        divMeetingRoom.appendChild(div);
        let self = this;
        var user = {
            id: userid,
            username: username,
            video: video,
            rtcPeer: null,
        };
        this.participants[user.id] = user;
        var options = {
            remoteVideo: video,
            onicecandidate: onIceCandidate,
        };
        user.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function (err) {
            if (err) {
                return console.error(err);
            }
            this.generateOffer(onOffer);
        });
        var onOffer = function (err, offer, wp) {
            //console.log("sending offer");
            var message = {
                event: "receiveVideoFrom",
                userid: user.id,
                roomName: self.roomName,
                sdpOffer: offer,
            };
            self.sendMessage(message);
        };
        function onIceCandidate(candidate, wp) {
            //console.log("sending ice candidates");
            var message = {
                event: "candidate",
                userid: user.id,
                roomName: self.roomName,
                candidate: candidate,
            };
            self.sendMessage(message);
        }
    }
    createRaiseHandDiv(userid) {
        let handDiv = document.createElement("div");
        let handImg = document.createElement("img");
        handDiv.className = "raiseHandDiv";
        handImg.src = require("../images/hand.png");
        handDiv.id = "hand_raised_" + userid;
        handDiv.append(handImg);
        return handDiv;
    }
    createVideoContHoverDiv(userid) {
        let usersInClass = this.state.usersInClass;
        usersInClass[userid] = { muted: false, allowed: false };
        this.setState(usersInClass);
        this.publishStatus();
        var hoverDiv = document.createElement("div");
        hoverDiv.style.width = "65px";
        hoverDiv.style.height = "60px";
        hoverDiv.style.zIndex = 10;
        hoverDiv.style.background = "#d4e0dfd4";
        hoverDiv.style.borderRadius = "4px";
        hoverDiv.style.position = "absolute";
        hoverDiv.style.display = "none";
        hoverDiv.id = "hov_" + userid;
        var muteButton = document.createElement("button");
        muteButton.className = "liteSmallButton";
        muteButton.style.margin = "4px 0px";
        muteButton.id = "mute_" + userid;
        var t1 = document.createTextNode("Mute");
        muteButton.append(t1);
        muteButton.addEventListener("click", () => {
            this.onSingleMute(userid);
        });
        hoverDiv.appendChild(muteButton);
        var allowButton = document.createElement("button");
        allowButton.className = "liteSmallButton";
        allowButton.id = "allow_" + userid;
        var t2 = document.createTextNode("Allow");
        allowButton.append(t2);
        allowButton.addEventListener("click", () => {
            this.onSingleAllow(userid);
        });
        hoverDiv.appendChild(allowButton);
        return hoverDiv;
    }
    onExistingParticipants(userid, existingUsers) {
        let divMeetingRoom = document.getElementById("videoDiv");
        if (this.state.confAudioOrVideo === "audio") {
            var video = document.createElement("audio");
        } else {
            var video = document.createElement("video");
        }
        var div = document.createElement("div");
        div.className = "videoContainer";
        div.id = "cont_" + userid;
        div.style.cursor = "pointer";
        if (this.state.userType === "t") {
            var hoverDiv = this.createVideoContHoverDiv(userid);
            var raiseHandDiv = this.createRaiseHandDiv(userid);
            div.append(raiseHandDiv);
            div.append(hoverDiv);
            div.addEventListener("mouseover", () => {
                this.onVideoContainerHover(userid);
            });
            div.addEventListener("mouseout", () => {
                this.onVideoContainerMouseOut(userid);
            });
        }
        var name = document.createElement("div");
        name.className = "videoContainerName";
        video.id = userid;
        video.autoplay = true;
        name.appendChild(document.createTextNode(this.userName));
        if (this.state.confAudioOrVideo === "audio") {
            let div1 = document.createElement("div");
            div1.style.width = "20px";
            div1.style.height = "36px";
            div.appendChild(div1);
        }
        div.appendChild(video);
        div.appendChild(name);
        divMeetingRoom.appendChild(div);
        let self = this;
        var user = {
            id: userid,
            username: self.userName,
            video: video,
            rtcPeer: null,
        };
        this.participants[user.id] = user;
        if (this.state.confAudioOrVideo === "audio") {
            var constraints = {
                audio: true,
                video: false,
            };
        } else {
            var constraints = {
                audio: true,
                video: {
                    mandatory: {
                        maxWidth: 100,
                        maxFrameRate: 15,
                        minFrameRate: 15,
                    },
                },
            };
        }
        var options = {
            localVideo: video,
            mediaConstraints: constraints,
            onicecandidate: onIceCandidate,
        };
        user.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function (err) {
            if (err) {
                return console.error(err);
            }
            this.generateOffer(onOffer);
        });
        existingUsers.forEach(function (element) {
            self.receiveVideo(element.id, element.name);
        });
        var onOffer = function (err, offer, wp) {
            //console.log("sending offer");
            var message = {
                event: "receiveVideoFrom",
                userid: user.id,
                roomName: self.roomName,
                sdpOffer: offer,
            };
            self.sendMessage(message);
        };
        function onIceCandidate(candidate, wp) {
            //console.log("sending ice candidates");
            var message = {
                event: "candidate",
                userid: user.id,
                roomName: self.roomName,
                candidate: candidate,
            };
            self.sendMessage(message);
        }
    }
    onReceiveVideoAnswer(senderid, sdpAnswer) {
        this.participants[senderid].rtcPeer.processAnswer(sdpAnswer);
    }
    addIceCandidate(userid, candidate) {
        this.participants[userid].rtcPeer.addIceCandidate(candidate);
    }
    // utilities
    sendMessage(message) {
        //console.log("sending " + message.event + " message to server");
        this.socket.emit("message", message);
    }
    startVideoConf(roomName, userName, initiator = false) {
        let socket = io();
        this.socket = socket;
        this.setState({ socket: socket });
        this.handleRemoteDrawing(socket);
        this.roomName = roomName;
        this.userName = userName;
        this.participants = {};
        var message = {
            event: "joinRoom",
            userName: userName,
            roomName: roomName,
        };
        this.sendMessage(message);
        this.socket.emit("my socket", {
            initiator: initiator,
            sid: this.state.sid,
            roomName: roomName,
        });
        // messages handlers
        this.socket.on("message", (message) => {
            //console.log("Message received: " + message.event);
            switch (message.event) {
                case "newParticipantArrived":
                    this.receiveVideo(message.userid, message.username);
                    break;
                case "existingParticipants":
                    this.onExistingParticipants(message.userid, message.existingUsers);
                    break;
                case "receiveVideoAnswer":
                    this.onReceiveVideoAnswer(message.senderid, message.sdpAnswer);
                    break;
                case "candidate":
                    this.addIceCandidate(message.userid, message.candidate);
                    break;
            }
        });
        this.socket.on("my socket", (data) => {
            this.setState({ mySocketId: data });
            //console.log(data);
        });
        this.socket.on("status", (data) => {
            this.updateStatus(data);
        });
        socket.on("draw config", (data) => {
            this.setState({ remoteStrokeSize: data.size, remoteStrokeColor: data.color });
            if (data.eraser) {
                this.setState({ remotePenSelected: false, remoteEraserSelected: true });
            } else {
                this.setState({ remotePenSelected: true, remoteEraserSelected: false });
            }
        });
        socket.on("scroll to", (data) => {
            this.handleDoScroll(data);
        });
        socket.on("hand raised", (data) => {
            this.onRaiseHand(data.userid);
        });
        socket.on("user left", (data) => {
            this.handleUserLeft(data);
        });
        socket.on("class ended", (data) => {
            //this.handleClassEnded();
        });
    }
    handleUserLeft = (data) => {
        //console.log(data);
        let usersInClass = this.state.usersInClass;
        delete usersInClass[data.socketId];
        this.setState({ usersInClass });
        let videoDiv = document.getElementById("videoDiv");
        let src = document.getElementById(data.socketId).srcObject;
        let cont = document.getElementById("cont_" + data.socketId);
        let tracks = src.getTracks();
        for (let j in tracks) {
            tracks[j].stop();
        }
        videoDiv.removeChild(cont);
    };
    startClass = (e) => {
        let confType = document.getElementById("confType_" + e.target.value).textContent;
        confType = confType.charAt(0).toLowerCase() + confType.slice(1);
        this.setState({ confAudioOrVideo: confType });
        let sid = this.state.sid;
        let classId = e.target.value;
        if (sid === "") {
            return;
        }
        fetch(`/api/teacher/${sid}/startclass/${classId}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                if (data.status === "started") {
                    alert("Class Started.");
                }
                this.setState({ classRunning: true });
                this.setState({ connectionStatus: 2 });
                this.setState({ roomName: data.roomName });
                this.startVideoConf(data.roomName, this.state.name, true);
            });
    };
    joinClass = (e) => {
        let confType = document.getElementById("confType_" + e.target.value).textContent;
        confType = confType.charAt(0).toLowerCase() + confType.slice(1);
        this.setState({ confAudioOrVideo: confType });
        this.setState({ classRunning: true });
        this.setState({ connectionStatus: 2 });
        this.setState({ roomName: e.target.value });
        this.startVideoConf(e.target.value, this.state.name, false);
    };
    onVideoContainerHover(id) {
        //let usersInClass = this.state.usersInClass;
        //console.log(usersInClass);
        let handImg = document.getElementById("hand_raised_" + id);
        handImg.style.display = "none";
        let hoverDiv = document.getElementById("hov_" + id);
        hoverDiv.style.display = "block";
    }
    onVideoContainerMouseOut(id) {
        //console.log(id);
        let hoverDiv = document.getElementById("hov_" + id);
        hoverDiv.style.display = "none";
    }
    raiseHand() {
        this.socket.emit("raise hand", { roomName: this.state.roomName });
        let raiseHandDiv = document.getElementById("raiseHand");
        raiseHandDiv.style.border = "1px solid red";
        setInterval(() => {
            raiseHandDiv.style.border = "none";
        }, 2000);
    }
    onRaiseHand(userid) {
        let handImg = document.getElementById("hand_raised_" + userid);
        handImg.style.display = "block";
        let handnotif = document.getElementById("handnotif");
        handnotif.play();
    }
    onSingleMute(id) {
        //console.log(e.target.id);
        let usersInClass = this.state.usersInClass;
        let user = usersInClass[id];
        //console.log(usersInClass[id]);
        let container = document.getElementById("cont_" + id);
        let muteButton = document.getElementById("mute_" + id);
        muteButton.removeChild(muteButton.childNodes[0]);
        if (user.muted) {
            let text = document.createTextNode("Mute");
            muteButton.appendChild(text);
            usersInClass[id].muted = false;
            this.setState({ usersInClass });
            this.publishStatus();
            container.style.backgroundColor = "#dde4f7";
        } else {
            let text = document.createTextNode("Unmute");
            muteButton.appendChild(text);
            usersInClass[id].muted = true;
            this.setState({ usersInClass });
            this.publishStatus();
            container.style.backgroundColor = "#969baf";
        }
    }
    onMuteAll = () => {
        let usersInClass = this.state.usersInClass;
        let mySocketId = this.state.mySocketId;
        //console.log(usersInClass);
        //console.log(mySocketId);
        let container;
        let muteButton;
        for (let i in usersInClass) {
            if (i !== mySocketId) {
                muteButton = document.getElementById("mute_" + i);
                muteButton.removeChild(muteButton.childNodes[0]);
                container = document.getElementById("cont_" + i);
                container.style.backgroundColor = "#969baf";
                usersInClass[i].muted = true;
                muteButton = document.getElementById("mute_" + i);
                muteButton = document.getElementById("mute_" + i);
                let text = document.createTextNode("Unmute");
                muteButton.appendChild(text);
            }
        }
        //console.log(usersInClass);
        this.setState({ usersInClass });
        this.publishStatus();
    };
    onUnmuteAll = () => {
        let usersInClass = this.state.usersInClass;
        let mySocketId = this.state.mySocketId;
        //console.log(usersInClass);
        //console.log(mySocketId);
        let container;
        let muteButton;
        for (let i in usersInClass) {
            if (i !== mySocketId) {
                muteButton = document.getElementById("mute_" + i);
                muteButton.removeChild(muteButton.childNodes[0]);
                container = document.getElementById("cont_" + i);
                container.style.backgroundColor = "#dde4f7";
                usersInClass[i].muted = false;
                muteButton = document.getElementById("mute_" + i);
                muteButton = document.getElementById("mute_" + i);
                let text = document.createTextNode("Mute");
                muteButton.appendChild(text);
            }
        }
        //console.log(usersInClass);
        this.setState({ usersInClass });
        this.publishStatus();
    };
    onSingleAllow(id) {
        let usersInClass = this.state.usersInClass;
        let user = usersInClass[id];
        let allowButton = document.getElementById("allow_" + id);
        let container = document.getElementById("cont_" + id);
        allowButton.removeChild(allowButton.childNodes[0]);
        if (user.allowed) {
            let text = document.createTextNode("Allow");
            allowButton.appendChild(text);
            usersInClass[id].allowed = false;
            this.setState({ usersInClass });
            this.publishStatus();
            container.style.borderColor = "rgb(221, 228, 247)";
        } else {
            let text = document.createTextNode("Disallow");
            allowButton.appendChild(text);
            usersInClass[id].allowed = true;
            this.setState({ usersInClass });
            this.publishStatus();
            container.style.borderColor = "red";
        }
    }
    publishStatus() {
        let status = Object.assign({}, this.state.usersInClass);
        //console.log(status);
        this.socket.emit("status", {
            roomName: this.state.roomName,
            status: status,
        });
        for (var i = 0; i <= 2; i++) {
            setTimeout(() => {
                //this.socket.emit("status", this.state.usersInClass);
            }, 1000);
        }
    }
    updateStatus(data) {
        //console.log(data);
        if (this.state.userType === "s") {
            this.setState({ usersInClass: data });
        }
        //console.log(data);
        for (let i in data) {
            let video = document.getElementById(i);
            //console.log(video);
            //console.log(video.srcObject);
            //return;
            let src = video.srcObject;
            let container;
            //console.log(i);
            if (data[i].muted) {
                if (src) {
                    let tracks = src.getTracks();
                    for (let j in tracks) {
                        tracks[j].enabled = false;
                    }
                    container = document.getElementById("cont_" + i);
                    container.style.backgroundColor = "#969baf";
                    //console.log("video", video.srcObject.getTracks());
                }
            } else {
                if (src) {
                    let tracks = src.getTracks();
                    for (let j in tracks) {
                        tracks[j].enabled = true;
                    }
                    container = document.getElementById("cont_" + i);
                    container.style.backgroundColor = "#dde4f7";
                    //console.log("video", video.srcObject.getTracks());
                }
            }
        }
    }
    handleOnScroll(e) {
        if (!this.state.classRunning) {
            return;
        }
        if (this.state.userType === "t") {
            const position = window.pageYOffset;
            this.socket.emit("scroll to", { roomName: this.state.roomName, scroll: position });
        }
    }
    handleDoScroll(data) {
        window.scrollTo(0, data.scroll);
    }
    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        path="/forgotpassword"
                        render={() =>
                            this.state.loggedIn !== 2 ? <ForgotPassword /> : <Redirect to="/" />
                        }
                    ></Route>
                    <Route
                        path="/login"
                        render={() =>
                            this.state.loggedIn === 0 || this.state.loggedIn === 4 ? (
                                <Loading />
                            ) : this.state.loggedIn === 1 ? (
                                <Login
                                    handleLogin={this.handleLogin}
                                    signupSuccess={this.state.signupSuccess}
                                />
                            ) : this.state.loggedIn === 2 ? (
                                <Redirect to="/" />
                            ) : (
                                <EmailNotVerified signupSuccess={this.state.signupSuccess} />
                            )
                        }
                    ></Route>
                    <Route
                        path="/signup"
                        render={() =>
                            !this.state.signupSuccess && this.state.loggedIn !== 2 ? (
                                <Signup
                                    signupFailed={this.state.signupFailed}
                                    signupFailedMessage={this.state.signupFailedMessage}
                                    handleSignup={this.handleSignup}
                                />
                            ) : (
                                <Redirect to="/login" />
                            )
                        }
                    ></Route>
                    <Route
                        path="/drawpage"
                        render={() =>
                            this.state.loggedIn === 0 ? (
                                <Loading />
                            ) : this.state.loggedIn === 2 ? (
                                <DrawPage
                                    remoteDrawing={false}
                                    userType={this.state.userType}
                                    students={this.state.students}
                                    connectionStatus={this.state.connectionStatus}
                                    handleConnectNow={this.handleConnectNow}
                                    handleConnect={this.handleConnect}
                                    handleStart={this.handleStart}
                                    handleDraw={this.handleDraw}
                                    handleStop={this.handleStop}
                                    isDrawing={this.state.isDrawing}
                                    handleAddAnotherPersion={this.handleAddAnotherPersion}
                                    selectedCanvas={this.state.selectedCanvas}
                                    totalNoOfCanvases={this.state.totalNoOfCanvases}
                                    handlePages={this.handlePages}
                                    sid={this.state.sid}
                                    fetchStudents={this.fetchStudents}
                                    handleAudioConnect={this.handleAudioConnect}
                                    handleVideoConnect={this.handleVideoConnect}
                                    peers={this.state.peers}
                                    name={this.state.name}
                                    socket={this.state.socket}
                                    usersConnected={this.state.usersConnected}
                                    handleAudioDisconnect={this.handleAudioDisconnect}
                                    handleVideoDisconnect={this.handleVideoDisconnect}
                                    handleLogoutClick={this.handleLogoutClick}
                                    peerInitiator={this.state.peerInitiator}
                                    pageActionAllowed={this.state.pageActionAllowed}
                                />
                            ) : (
                                <Redirect to="/login" />
                            )
                        }
                    ></Route>
                    <Route
                        path="/notes"
                        render={() =>
                            this.state.loggedIn === 0 ? (
                                <Loading />
                            ) : this.state.loggedIn === 2 ? (
                                <Notes
                                    fetchNotes={this.fetchNotes}
                                    notes={this.state.notes}
                                    sid={this.state.sid}
                                />
                            ) : (
                                <Redirect to="/login" />
                            )
                        }
                    ></Route>
                    <Route
                        path="/profile"
                        render={() =>
                            this.state.loggedIn === 0 ? (
                                <Loading />
                            ) : this.state.loggedIn === 2 ? (
                                <Profile sid={this.state.sid} />
                            ) : (
                                <Redirect to="/login" />
                            )
                        }
                    ></Route>
                    <Route path="/about" render={() => <About />}></Route>
                    <Route
                        path="/"
                        render={() =>
                            this.state.loggedIn === 0 ? (
                                <Loading />
                            ) : this.state.loggedIn === 2 ? (
                                this.state.connectionStatus === 2 ? (
                                    <DrawPage
                                        endSession={this.endSession}
                                        handleStart={this.handleStart1}
                                        handleDraw={this.handleDraw1}
                                        handleStop={this.handleStop1}
                                        isDrawing={this.state.isDrawing}
                                        remoteX={this.state.remoteX}
                                        remoteY={this.state.remoteY}
                                        remoteDrawing={true}
                                        userType={this.state.userType}
                                        students={this.state.students}
                                        connectionStatus={this.state.connectionStatus}
                                        handleAddAnotherPersion={this.handleAddAnotherPersion}
                                        selectedCanvas={this.state.selectedCanvas}
                                        totalNoOfCanvases={this.state.totalNoOfCanvases}
                                        handlePages={this.handlePages}
                                        sid={this.state.sid}
                                        fetchStudents={this.fetchStudents}
                                        handleAudioConnect={this.handleAudioConnect}
                                        handleVideoConnect={this.handleVideoConnect}
                                        peers={this.state.peers}
                                        name={this.state.name}
                                        socket={this.state.socket}
                                        usersConnected={this.state.usersConnected}
                                        handleAudioDisconnect={this.handleAudioDisconnect}
                                        handleVideoDisconnect={this.handleVideoDisconnect}
                                        handleLogoutClick={this.handleLogoutClick}
                                        peerInitiator={this.state.peerInitiator}
                                        classRunning={this.state.classRunning}
                                        roomName={this.state.roomName}
                                        pageActionAllowed={this.state.pageActionAllowed}
                                        usersInClass={this.state.usersInClass}
                                        onMuteAll={this.onMuteAll}
                                        onUnmuteAll={this.onUnmuteAll}
                                        raiseHand={this.raiseHand}
                                    />
                                ) : (
                                    <Home
                                        userType={this.state.userType}
                                        handleLogoutClick={this.handleLogoutClick}
                                        handleStudentSearch={this.handleStudentSearch}
                                        sid={this.state.sid}
                                        handleConnectNow={this.handleConnectNow}
                                        incoming={this.state.incoming}
                                        connectionStatus={this.state.connectionStatus}
                                        connectId={this.state.connectId}
                                        incomingFrom={this.state.incomingFrom}
                                        handleConnect={this.handleConnect}
                                        teachers={this.state.teachers}
                                        students={this.state.students}
                                        fetchTeachers={this.fetchTeachers}
                                        fetchStudents={this.fetchStudents}
                                        startClass={this.startClass}
                                        joinClass={this.joinClass}
                                    />
                                )
                            ) : (
                                <Redirect to="/login" />
                            )
                        }
                    ></Route>
                </Switch>
            </Router>
        );
    }
}

export default MainComponent;
