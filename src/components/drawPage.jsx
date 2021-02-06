import React, { Component } from "react";
import DrawingConfig from "./drawing/drawingConfig";
import Draw from "./drawing/draw";
import Communication from "./drawing/communication";
import Actions from "./drawing/actions";
import { withRouter } from "react-router-dom";

class DrawPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            strokeSize: 1,
            strokeColor: "black",
            eraserSelected: false,
            penSelected: true,
            remoteDrawing: this.props.remoteDrawing,
            documentId: "",
            notification: "",
        };
        this.handleStrokeSize = this.handleStrokeSize.bind(this);
        this.handleStrokeColor = this.handleStrokeColor.bind(this);
        this.handleEraser = this.handleEraser.bind(this);
        this.handlePen = this.handlePen.bind(this);
        this.handleRemoteDrawing = this.handleRemoteDrawing.bind(this);
        this.handleClearPage = this.handleClearPage.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.listenToSocket = this.listenToSocket.bind(this);
        this.notification = this.notification.bind(this);
        this.handleConnectNow = this.handleConnectNow.bind(this);
        this.sendDrawConfigStatus = this.sendDrawConfigStatus.bind(this);
        this.handleSync = this.handleSync.bind(this);
    }
    componentDidMount() {
        if (this.props.connectionStatus === 2) {
            let socket = this.props.socket;
            if (socket !== "") this.listenToSocket(socket);
            if (this.props.peerInitiator) {
                this.notification("Connecting...", true);
            } else {
                this.notification("Connected");
            }
        }
        this.sendDrawConfigStatus();
    }
    componentDidUpdate(prevProps) {
        //console.log(this.props.usersConnected.length);
        if (prevProps.connectionStatus !== this.props.connectionStatus) {
            if (this.props.connectionStatus === 2) {
                let socket = this.props.socket;
                if (socket !== "") this.listenToSocket(socket);
            }
        }
        if (this.props.usersConnected.length > prevProps.usersConnected.length) {
            this.notification("1 Connected.");
            //console.log("1 Connected");
        }
        if (this.props.usersConnected.length < prevProps.usersConnected.length) {
            this.notification("1 Disconnected.");
            //console.log("1 Connected");
        }
    }
    listenToSocket(socket) {
        socket.on("next page", (data) => {
            this.handleNextPage("", true);
        });
        socket.on("prev page", (data) => {
            this.handlePrevPage("", true);
        });
        socket.on("clear page", (data) => {
            this.handleClearPage("", true);
        });
        socket.on("class ended", (data) => {
            this.handleClassEnded();
        });
        socket.on("sync", (data) => {
            this.onSync(data);
        });
    }
    handleClassEnded = () => {
        this.handleSave();
        alert("Class Ended.");
        window.location.reload();
    };
    handleStrokeSize(size) {
        this.setState({ strokeSize: size });
        this.sendDrawConfigStatus(size, this.state.strokeColor, this.state.eraserSelected);
        let canvas = document.querySelector("canvas");
        switch (parseInt(size)) {
            case 1:
                canvas.className = "cursor1";
                break;
            case 2:
                canvas.className = "cursor2";
                break;
            case 3:
                canvas.className = "cursor3";
                break;
            case 4:
                canvas.className = "cursor4";
                break;
        }

        //console.log(size);
    }
    handleStrokeColor(color) {
        this.setState({ strokeColor: color });
        this.sendDrawConfigStatus(this.state.strokeSize, color, this.state.eraserSelected);
        //console.log(color);
    }
    handleEraser(param) {
        this.setState({ eraserSelected: true });
        this.sendDrawConfigStatus(this.state.strokeSize, this.state.strokeColor, true);
        //console.log("eraser");
    }
    handlePen(param) {
        this.setState({ penSelected: true });
        this.setState({ eraserSelected: false });
        this.sendDrawConfigStatus(this.state.strokeSize, this.state.strokeColor, false);
        //console.log("pen");
    }
    handleClearPage(e, remote = false) {
        if (!remote) {
            if (!this.props.pageActionAllowed) {
                return;
            }
            if (this.props.connectionStatus === 2) {
                if (this.props.socket !== "") {
                    this.props.socket.emit("clear page", { roomName: this.props.roomName });
                }
            }
        }
        let currentPageNo = this.props.selectedCanvas;
        let canvas = document.getElementById(`canvas${currentPageNo}`);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (e !== "") e.target.blur();
    }
    downloadImage(data, filename = "untitled.jpeg") {
        var a = document.createElement("a");
        a.href = data;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    }
    handleSave(e = "", remote = false) {
        this.notification("Saving.");
        let currentPageNo = this.props.selectedCanvas;
        //let dataUrl = canvas.toDataURL("image/png", 1.0);
        //this.downloadImage(dataUrl, "my-canvas.jpeg");
        let documentName = document.getElementById("documentName").value;

        if (this.state.documentId === "") {
            fetch(`/api/savedocument/${this.props.sid}/${documentName}`)
                .then((response) => response.json())
                .then((data) => {
                    //console.log(data.documentId);
                    this.saveDocunmentPages(data.documentId, []);
                    this.setState({ documentId: data.documentId });
                });
        } else {
            fetch(`/api/updatedocument/${this.props.sid}/${this.state.documentId}/${documentName}`)
                .then((response) => response.json())
                .then((data) => {
                    //console.log(data.documentId);
                    this.saveDocunmentPages(data.documentId, data.pagesExist);
                    this.setState({ documentId: data.documentId });
                });
        }
        if (e !== "") e.target.blur();
    }
    saveDocunmentPages(documentId, pagesExist) {
        let noOfPagesExist = pagesExist.length;
        let formData = new FormData(); //formdata object
        let totalNoOfPages = this.props.totalNoOfCanvases;
        //console.log("noOfPagesExist", pagesExist.length);

        for (var i = 1; i <= totalNoOfPages; i++) {
            let canvas = document.getElementById(`canvas${i}`);
            let pageTitle = document.getElementById(`pageTitle${i}`).value;
            //console.log(pageTitle);
            formData.append("page", canvas.toDataURL("image/jpg"));
            formData.append("pageTitle", pageTitle);
            if (i <= noOfPagesExist) {
                formData.append("id", pagesExist[i - 1].pageId); //append the values with key, value pair
                const requestOptions = {
                    method: "POST",
                    headers: {},
                    body: formData,
                };
                fetch("/api1/updatedocumentpages", requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        //console.log(data);
                    });
            } else {
                formData.append("documentId", documentId); //append the values with key, value pair
                const requestOptions = {
                    method: "POST",
                    headers: {},
                    body: formData,
                };
                fetch("/api1/savedocumentpages", requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        //console.log(data);
                    });
            }
            if (i === totalNoOfPages) this.notification("Saved.");
        }
    }
    HandleAutoSave = () => {
        let checkBox = document.getElementById("autoSave");
        if (checkBox.checked) {
            this.autoSave = setInterval(() => {
                this.handleSave();
            }, 20000);
        } else {
            clearInterval(this.autoSave);
        }
    };
    handleRemoteDrawing(status) {
        this.setState({ remoteDrawing: status });
    }
    handleNextPage = (e, remote = false) => {
        if (!remote) {
            if (!this.props.pageActionAllowed) {
                return;
            }
            if (this.props.connectionStatus === 2) {
                if (this.props.socket !== "") {
                    this.props.socket.emit("next page", { roomName: this.props.roomName });
                }
            }
        }
        let currentPageNo = this.props.selectedCanvas;
        let noOfCanvases = this.props.totalNoOfCanvases;
        if (currentPageNo < noOfCanvases) {
            this.goToNextPage(currentPageNo);
        } else {
            let newCanvas = document.createElement("canvas");
            let newCanvasId = noOfCanvases + 1;
            newCanvas.setAttribute("id", `canvas${newCanvasId}`);
            newCanvas.setAttribute("width", "920");
            newCanvas.setAttribute("height", "760");
            newCanvas.setAttribute("style", "background:#fff; margin:5px;");
            let drawBox = document.getElementById("drawBox");
            let currentCanvas = document.getElementById(`canvas${currentPageNo}`);
            currentCanvas.setAttribute("style", "display:none");
            drawBox.appendChild(newCanvas);

            let pageTitleDiv = document.getElementById("pageTitleDiv");
            let currentPageTitle = document.getElementById(`pageTitle${currentPageNo}`);
            let newPageTitle = document.createElement("input");
            newPageTitle.setAttribute("id", `pageTitle${newCanvasId}`);
            newPageTitle.setAttribute("class", "defaultInput");
            newPageTitle.setAttribute("value", `Page ${newCanvasId}`);
            newPageTitle.setAttribute("style", "width: 106px;");
            currentPageTitle.setAttribute("style", "display:none");
            pageTitleDiv.appendChild(newPageTitle);
            this.props.handlePages(newCanvasId, newCanvasId);
        }
        if (e !== "") e.target.blur();
    };
    goToNextPage = (currentPageNo) => {
        let nextPageNo = currentPageNo + 1;
        let currentPage = document.getElementById(`canvas${currentPageNo}`);
        let nextPage = document.getElementById(`canvas${nextPageNo}`);
        let currentPageTitle = document.getElementById(`pageTitle${currentPageNo}`);
        let nextPageTitle = document.getElementById(`pageTitle${nextPageNo}`);

        currentPage.setAttribute("style", "display:none");
        currentPageTitle.setAttribute("style", "display:none");
        nextPage.setAttribute("style", "display:unset;background:#fff;margin:5px;");
        nextPageTitle.setAttribute("style", "display:unset;width:106px;");

        this.props.handlePages(nextPageNo, this.props.totalNoOfCanvases);
    };
    handlePrevPage = (e, remote = false) => {
        if (!remote) {
            if (!this.props.pageActionAllowed) {
                return;
            }
            if (this.props.connectionStatus === 2) {
                if (this.props.socket !== "") {
                    this.props.socket.emit("prev page", { roomName: this.props.roomName });
                }
            }
        }
        let currentPageNo = this.props.selectedCanvas;
        let prevPageNo = currentPageNo - 1;
        if (prevPageNo >= 1) {
            let currentCanvas = document.getElementById(`canvas${currentPageNo}`);
            let prevCanvas = document.getElementById(`canvas${prevPageNo}`);
            let currentPageTitle = document.getElementById(`pageTitle${currentPageNo}`);
            let prevPageTitle = document.getElementById(`pageTitle${prevPageNo}`);

            currentCanvas.setAttribute("style", "display:none");
            prevCanvas.setAttribute("style", "display:unset;background:#fff; margin:5px;");
            currentPageTitle.setAttribute("style", "display:none");
            prevPageTitle.setAttribute("style", "display:unset;width:106px;");
            this.props.handlePages(prevPageNo, this.props.totalNoOfCanvases);
        }
        if (e !== "") e.target.blur();
    };
    notification(message, neverStop = false) {
        let notification = (
            <div
                style={{
                    width: 180,
                    backgroundColor: "rgb(226, 204, 204)",
                    textAlign: "center",
                    borderRadius: 4,
                    padding: 5,
                    color: "cadetblue",
                    fontWeight: 500,
                }}
            >
                {message}
            </div>
        );
        this.setState({ notification });
        if (!neverStop) {
            setTimeout(() => {
                this.setState({ notification: "" });
            }, 2000);
        }
    }
    handleConnectNow(email) {
        this.notification("Connecting...", true);
        this.props.handleConnectNow(email);
    }
    handleBack = () => {
        this.props.history.goBack();
    };
    sendDrawConfigStatus(size, color, eraser) {
        let socket = this.props.socket;
        let drawConfig = {
            roomName: this.props.roomName,
            size: size,
            color: color,
            eraser: eraser,
        };
        if (this.props.userType === "t") {
            if (socket && this.props.classRunning) {
                socket.emit("draw config", drawConfig);
            }
        }
    }
    handleSync() {
        let totalNoOfPages = this.props.totalNoOfCanvases;
        let canvas;
        let pages = [];
        for (var i = 1; i <= totalNoOfPages; i++) {
            canvas = document.getElementById(`canvas${i}`);
            pages.push(canvas.toDataURL("image/jpg"));
        }
        //console.log(pages);
        this.notification("Syncing.Please Wait.", true);
        if (this.props.classRunning) {
            let strokeSize = this.state.strokeSize;
            let strokeColor = this.state.strokeColor;
            let eraserSelected = this.state.eraserSelected;
            this.sendDrawConfigStatus(strokeSize, strokeColor, eraserSelected);
            this.props.socket.emit("sync", { roomName: this.props.roomName, pages: pages });
        }
        setTimeout(() => {
            this.notification("");
        }, 5000);
    }
    onSync(data) {
        //console.log(data);
        let pages = data.pages;
        let totalNoOfCanvases = this.props.totalNoOfCanvases;
        //console.log(pages.length - totalNoOfCanvases);
        for (let i = 1; i <= pages.length - totalNoOfCanvases; i++) {
            //console.log("next page");
            this.handleNextPage("", true);
        }
        let canvas;
        let ctx;
        let img;
        for (let j in pages) {
            canvas = document.getElementById(`canvas${parseInt(j) + 1}`);
            ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            img = new Image();
            img.src = pages[j];
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
            };
        }
    }
    render() {
        return (
            <div style={{ backgroundColor: "aliceblue", minWidth: 1349 }}>
                <div style={{ display: "inline-block", verticalAlign: "top", float: "left" }}>
                    <div>
                        <p
                            style={{ float: "left", margin: 4, cursor: "pointer" }}
                            onClick={this.handleBack}
                        >
                            <img src={require("../images/back.png")} alt="" />
                        </p>
                    </div>
                    <Actions
                        endSession={this.props.endSession}
                        currentPage={this.props.selectedCanvas}
                        totalNofCanvases={this.props.totalNoOfCanvases}
                        handleNextPage={this.handleNextPage}
                        handlePrevPage={this.handlePrevPage}
                        handleClearPage={this.handleClearPage}
                        handleSave={this.handleSave}
                        socket={this.props.socket}
                        usersConnected={this.props.usersConnected}
                        notification={this.state.notification}
                        handleLogoutClick={this.props.handleLogoutClick}
                        connectionStatus={this.props.connectionStatus}
                        HandleAutoSave={this.HandleAutoSave}
                        userType={this.props.userType}
                        usersInClass={this.props.usersInClass}
                        classRunning={this.props.classRunning}
                        handleSync={this.handleSync}
                    />
                    <DrawingConfig
                        handleStrokeSize={this.handleStrokeSize}
                        handleStrokeColor={this.handleStrokeColor}
                        handleEraser={this.handleEraser}
                        handlePen={this.handlePen}
                        strokeSize={this.state.strokeSize}
                        strokeColor={this.state.strokeColor}
                    />
                    <Draw
                        strokeSize={this.state.strokeSize}
                        strokeColor={this.state.strokeColor}
                        eraserSelected={this.state.eraserSelected}
                        penSelected={this.state.penSelected}
                        handleStart={this.props.handleStart}
                        handleDraw={this.props.handleDraw}
                        handleStop={this.props.handleStop}
                        isDrawing={this.props.isDrawing}
                        remoteX={this.props.remoteX}
                        remoteY={this.props.remoteY}
                        remoteDrawing={this.state.remoteDrawing}
                        selectedCanvas={this.props.selectedCanvas}
                        classRunning={this.props.classRunning}
                        pageActionAllowed={this.props.pageActionAllowed}
                    />
                </div>
                <div style={{ display: "inline-block", verticalAlign: "top" }}>
                    <Communication
                        students={this.props.students}
                        connectionStatus={this.props.connectionStatus}
                        handleConnectNow={this.handleConnectNow}
                        handleConnect={this.props.handleConnect}
                        handleRemoteDrawing={this.handleRemoteDrawing}
                        handleAddAnotherPersion={this.props.handleAddAnotherPersion}
                        fetchStudents={this.props.fetchStudents}
                        userType={this.props.userType}
                        sid={this.props.sid}
                        handleAudioConnect={this.props.handleAudioConnect}
                        handleAudioDisconnect={this.props.handleAudioDisconnect}
                        handleVideoConnect={this.props.handleVideoConnect}
                        handleVideoDisconnect={this.props.handleVideoDisconnect}
                        peers={this.props.peers}
                        name={this.props.name}
                        socket={this.props.socket}
                        usersConnected={this.props.usersConnected}
                        classRunning={this.props.classRunning}
                        usersInClass={this.props.usersInClass}
                        roomName={this.props.roomName}
                        onMuteAll={this.props.onMuteAll}
                        onUnmuteAll={this.props.onUnmuteAll}
                        endSession={this.props.endSession}
                        handleLogoutClick={this.props.handleLogoutClick}
                        raiseHand={this.props.raiseHand}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(DrawPage);
