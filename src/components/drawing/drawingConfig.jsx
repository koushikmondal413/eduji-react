import React, { Component } from "react";
import "./drawingConfig.css";
import PenSize from "./penSize";
import PenColor from "./penColor";

class DrawingConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            penSizeActive: false,
            penColorActive: false,
            top: 0,
            left: 0,
            penSizePosition: "",
            penColorPosition: "",
        };

        this.handlePenClick = this.handlePenClick.bind(this);
        this.handlePenSizeClick = this.handlePenSizeClick.bind(this);
        this.handlePenColorClick = this.handlePenColorClick.bind(this);
        this.handleEraserClick = this.handleEraserClick.bind(this);
        this.handleStrokeSize = this.handleStrokeSize.bind(this);
        this.handleStrokeColor = this.handleStrokeColor.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    componentDidMount() {
        document.addEventListener("click", this.handlePageClick);
    }
    handlePageClick(e) {
        let penSizeDiv = document.getElementById("penSizeDiv");
        let penColorDiv = document.getElementById("penColorDiv");
        if (this.state.penSizeActive) {
            if (
                e.target !== penSizeDiv &&
                e.target.parentElement !== document.getElementById("strokeSize") &&
                !penSizeDiv.contains(e.target)
            ) {
                this.setState({ penSizeActive: false });
            }
        }
        if (this.state.penColorActive) {
            if (
                e.target !== penColorDiv &&
                e.target.parentElement !== document.getElementById("strokeColor") &&
                !penColorDiv.contains(e.target)
            ) {
                this.setState({ penColorActive: false });
            }
        }
    }
    handleStrokeSize(size) {
        this.props.handleStrokeSize(size);
    }
    handleStrokeColor(color) {
        this.props.handleStrokeColor(color);
    }

    handlePenClick() {
        this.props.handlePen(true);
        let pen = document.querySelector("#pen");
        let eraser = document.querySelector("#eraser");
        pen.classList.add("dciActive");
        eraser.classList.remove("dciActive");
    }

    handlePenSizeClick(e) {
        let position = e.target.getBoundingClientRect();
        this.setState({ penSizePosition: position });
        this.setState({ top: position.top });
        this.setState({ left: position.left });

        if (this.state.penSizeActive === false) {
            this.setState({ penSizeActive: true });
        } else {
            this.setState({ penSizeActive: false });
        }
    }
    handlePenColorClick(e) {
        let position = e.target.getBoundingClientRect();
        this.setState({ top: position.top });
        this.setState({ left: position.left });
        this.setState({ penColorPosition: position });

        if (this.state.penColorActive === false) {
            this.setState({ penColorActive: true });
        } else {
            this.setState({ penColorActive: false });
        }
    }
    handleEraserClick() {
        this.props.handleEraser(true);
        let pen = document.querySelector("#pen");
        let eraser = document.querySelector("#eraser");
        pen.classList.remove("dciActive");
        eraser.classList.add("dciActive");
        this.setState({ eraserSelected: true });
    }

    render() {
        const drawingConfig = {
            position: "fixed",
            top: 0,
            left: 0,
            margin: "10% 0%",
            width: 40,
            height: "auto",
            border: "1px solid #ccc",
            color: "aliceblue",
            boxShadow: "1px 1px 6px #ccc",
            //background: "#cea6a6",
            borderRadius: 2,
        };
        const drawConfigIcon = {
            cursor: "pointer",
            border: "1px solid green",
            //padding: "8px 0px 10px 0px",
            padding: "4px 3px",
            margin: 2,
            borderRadius: 2,
        };
        //console.log(this.state.top);
        //console.log(this.state.left);

        let penSize;
        if (this.state.penSizeActive === true) {
            penSize = (
                <PenSize
                    handleStrokeSize={this.handleStrokeSize}
                    top={this.state.top}
                    left={this.state.left}
                    strokeSize={this.props.strokeSize}
                />
            );
        } else {
            penSize = "";
        }
        let penColor;
        if (this.state.penColorActive === true) {
            penColor = (
                <PenColor
                    handleStrokeColor={this.handleStrokeColor}
                    top={this.state.top}
                    left={this.state.left}
                    strokeColor={this.props.strokeColor}
                />
            );
        } else {
            penColor = "";
        }
        return (
            <div style={drawingConfig}>
                <div
                    className="dciActive"
                    id="pen"
                    style={drawConfigIcon}
                    onClick={this.handlePenClick}
                >
                    <img style={{ height: 28 }} src={require("../../images/pen.png")} alt="pen" />
                </div>
                <div id="strokeSize" style={drawConfigIcon} onClick={this.handlePenSizeClick}>
                    <img
                        src={require("../../images/line-width.png")}
                        alt="line-width"
                        style={{ width: 28, height: 28 }}
                    />
                </div>
                {penSize}
                <div id="strokeColor" style={drawConfigIcon} onClick={this.handlePenColorClick}>
                    <img
                        style={{ height: 26 }}
                        src={require("../../images/color.png")}
                        alt="color"
                    />
                </div>
                {penColor}
                <div
                    id="eraser"
                    style={{
                        cursor: "pointer",
                        border: "1px solid green",
                        padding: "4px",
                        fontSize: 14,
                        margin: 2,
                        borderRadius: 2,
                    }}
                    onClick={this.handleEraserClick}
                >
                    <img
                        style={{ height: 28 }}
                        src={require("../../images/eraser.png")}
                        alt="eraser"
                    />
                </div>
            </div>
        );
    }
}

export default DrawingConfig;
