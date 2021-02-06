import React, { Component } from "react";
import "./draw.css";

class Draw extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.start = this.start.bind(this);
        this.draw = this.draw.bind(this);
        this.stop = this.stop.bind(this);
        this.erase = this.erase.bind(this);
    }

    isDrawing = false;
    componentDidMount() {
        let canvas = document.getElementById(`canvas${this.props.selectedCanvas}`);
        if (canvas) {
            let ctx = canvas.getContext("2d");
            this.canvas = canvas;
            this.ctx = ctx;

            canvas.addEventListener("pointerdown", this.start);
            canvas.addEventListener("pointermove", this.draw);
            canvas.addEventListener("pointerup", this.stop);
        }
        /*if (this.props.remoteX !== 0 || this.props.remoteY !== 0) {
      console.log("remote draw");
      if (this.props.isDrawing) {
        console.log("remote draw");
        this.remoteDraw(this.props.remoteX, this.props.remoteY);
      }
    }*/
    }
    componentDidUpdate() {
        let canvas = document.getElementById(`canvas${this.props.selectedCanvas}`);
        let ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.ctx = ctx;

        canvas.addEventListener("pointerdown", this.start);
        canvas.addEventListener("pointermove", this.draw);
        canvas.addEventListener("pointerup", this.stop);
    }

    remoteDraw(x, y, touch = false) {
        this.ctx.lineWidth = this.props.strokeSize;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(x, y);
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.strokeStyle = `${this.props.strokeColor}`;
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        //console.log(x, y);
    }

    start(e, touch = false) {
        //console.log(this.props.pageActionAllowed);
        if (!this.props.pageActionAllowed) {
            return;
        }
        this.isDrawing = true;
        this.draw(e);
        let x, y;
        x = e.clientX - this.canvas.getBoundingClientRect().left;
        y = e.clientY - this.canvas.getBoundingClientRect().top;

        if (this.props.remoteDrawing) this.props.handleStart(x, y);
    }

    draw(e, touch = false) {
        if (!this.props.pageActionAllowed) {
            return;
        }

        let x, y;
        x = e.clientX - this.canvas.getBoundingClientRect().left;
        y = e.clientY - this.canvas.getBoundingClientRect().top;

        if (this.props.remoteDrawing) this.props.handleDraw(x, y);

        if (this.props.eraserSelected) {
            this.erase(e);
            return;
        }

        if (!this.isDrawing) return;
        this.ctx.lineWidth = this.props.strokeSize;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(x, y);
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.strokeStyle = `${this.props.strokeColor}`;
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        //console.log(x, y);
    }

    stop() {
        if (!this.props.pageActionAllowed) {
            return;
        }
        this.isDrawing = false;
        this.ctx.beginPath();

        if (this.props.remoteDrawing) this.props.handleStop();
    }

    erase(e) {
        let x = e.clientX - this.canvas.getBoundingClientRect().left;
        let y = e.clientY - this.canvas.getBoundingClientRect().top;

        if (!this.isDrawing) return;
        this.ctx.lineWidth = this.props.strokeSize;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(x, y);
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.strokeStyle = "rgba(255,255,255,1)";
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        //console.log("er");
    }
    render() {
        const draw = {
            margin: "10px 20px 10px 100px",
            width: "fit-content",
            height: "fit-content",
            border: "1px solid #64c3ba",
            boxShadow: "rgb(204, 204, 204) 1px 1px 6px, rgb(143, 222, 222) 0px 0px 20px inset",
            touchAction: "none",
        };
        return (
            <div style={{}}>
                <div style={draw} className="drawBox" id="drawBox">
                    <img
                        id="remoteC"
                        style={{ position: "fixed", top: -10, left: -10 }}
                        src={require("../../images/remoteC.png")}
                        alt="o"
                    />
                    <canvas
                        id="canvas1"
                        width="920"
                        height="760"
                        style={{
                            background: "#fff",
                            margin: "5px",
                        }}
                    ></canvas>
                </div>
            </div>
        );
    }
}

export default Draw;
