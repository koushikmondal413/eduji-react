import React, { Component } from "react";

class PenSize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            top: props.top,
            left: props.left + 40,
            penSizes: [1, 2, 3, 4],
        };
        this.handleSizeChange = this.handleSizeChange.bind(this);
    }
    handleSizeChange(e) {
        //console.log(e.target.value);
        this.props.handleStrokeSize(e.target.value);
    }
    render() {
        const penSize = {
            width: "auto",
            height: "auto",
            position: "fixed",
            top: this.state.top,
            left: this.state.left,
            background: "rgb(195, 234, 229)",
            padding: 4,
            borderRadius: 4,
        };
        let penSizes = this.state.penSizes;
        let penSizeOptions = [];
        for (let i = 1; i <= penSizes.length; i++) {
            if (i === parseInt(this.props.strokeSize)) {
                penSizeOptions.push(
                    <option selected value={i}>
                        {i}
                    </option>
                );
            } else {
                penSizeOptions.push(<option value={i}>{i}</option>);
            }
        }
        return (
            <div style={penSize} id="penSizeDiv">
                <select
                    style={{ fontSize: 16, color: "black" }}
                    name="penSize"
                    id="penSize"
                    onChange={this.handleSizeChange}
                >
                    {penSizeOptions}
                </select>
            </div>
        );
    }
}

export default PenSize;
