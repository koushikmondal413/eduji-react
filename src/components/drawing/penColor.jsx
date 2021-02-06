import React, { Component } from "react";

class PenColor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            top: props.top,
            left: props.left + 40,
            penColors: ["black", "green", "red"],
        };
        this.handleColorSelect = this.handleColorSelect.bind(this);
    }
    handleColorSelect(e) {
        //console.log(e.target.value);
        this.props.handleStrokeColor(e.target.value);
    }
    render() {
        const penColor = {
            width: "auto",
            height: "auto",
            position: "fixed",
            top: this.state.top,
            left: this.state.left,
            textAlign: "left",
            background: "rgb(195, 234, 229)",
            padding: 4,
            borderRadius: 4,
        };
        const colorDiv = {
            padding: "6px 0px",
        };
        let penColors = this.state.penColors;
        let penColorOptions = [];
        for (let i in penColors) {
            let color1 = penColors[i];
            if (penColors[i] === this.props.strokeColor) {
                penColorOptions.push(
                    <div style={{ padding: "6px 0px", color: color1 }}>
                        <input
                            type="radio"
                            name="penColor"
                            id="penColorb"
                            value={color1}
                            onClick={this.handleColorSelect}
                            checked
                        />
                        <label style={{ fontWeight: 200 }} htmlFor="penColorb">
                            &nbsp;{color1.charAt(0).toUpperCase() + color1.slice(1)}
                        </label>
                    </div>
                );
            } else {
                penColorOptions.push(
                    <div style={{ padding: "6px 0px", color: color1 }}>
                        <input
                            type="radio"
                            name="penColor"
                            id="penColorb"
                            value={color1}
                            onClick={this.handleColorSelect}
                        />
                        <label style={{ fontWeight: 200 }} htmlFor="penColorb">
                            &nbsp;{color1.charAt(0).toUpperCase() + color1.slice(1)}
                        </label>
                    </div>
                );
            }
        }
        return (
            <div style={penColor} id="penColorDiv">
                {penColorOptions}
            </div>
        );
    }
}

export default PenColor;
