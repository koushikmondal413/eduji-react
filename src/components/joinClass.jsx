import React, { Component } from "react";

class JoinClass extends Component {
    state = { pageBody: "" };
    componentDidMount() {
        this.activeClass();
    }
    activeClass = () => {
        this.setState({ pageBody: "" });
        let activeClasses = this.props.activeclasses;
        let classes = [];
        //console.log(activeClasses[0]);
        classes.push(
            <>
                <h4>
                    Classes Going On&nbsp;&nbsp;
                    <img
                        src={require("../images/refresh.png")}
                        alt="Refresh"
                        style={{ cursor: "pointer" }}
                        onClick={this.props.refreshJoinClass}
                    />
                </h4>
                <br />
            </>
        );
        let datetime;
        if (activeClasses.length <= 0) {
            classes.push(
                <div
                    style={{
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    No Classes
                </div>
            );
            this.setState({ pageBody: classes });
            return;
        }
        for (let i in activeClasses) {
            datetime = new Date(activeClasses[i].started);

            classes.push(
                <div
                    style={{
                        border: "1px solid yellow",
                        borderRadius: 2,
                        margin: "1% 0%",
                        textAlign: "left",
                    }}
                >
                    <div
                        style={{
                            width: "65%",
                            display: "inline-block",
                            color: "white",
                            padding: 20,
                            verticalAlign: "middle",
                        }}
                    >
                        <div
                            style={{ width: "60%", display: "inline-block", verticalAlign: "top" }}
                        >
                            {activeClasses[i].className}
                        </div>

                        <div style={{ width: "40%", display: "inline-block" }}>
                            Started On : {datetime.getHours()}:{datetime.getMinutes()}
                        </div>
                    </div>
                    <div
                        id={"confType_" + activeClasses[i].id}
                        style={{
                            width: "15%",
                            display: "inline-block",
                            color: "#77e277",
                            textAlign: "center",
                            padding: 20,
                        }}
                    >
                        {activeClasses[i].confType === 1 ? "Audio" : "Video"}
                    </div>
                    <div
                        style={{
                            width: "20%",
                            display: "inline-block",
                            color: "green",
                            textAlign: "center",
                            padding: 20,
                        }}
                    >
                        <button
                            className="liteButton"
                            value={activeClasses[i].id}
                            onClick={this.props.joinClass}
                        >
                            Join
                        </button>
                    </div>
                </div>
            );
        }
        this.setState({ pageBody: classes });
    };
    render() {
        return (
            <>
                <div
                    style={{
                        width: 120,
                        height: 900,
                        display: "inline-block",

                        float: "left",
                    }}
                >
                    <div
                        className="headerElement2"
                        style={{ width: 120 }}
                        onClick={this.activeClass}
                    >
                        Active Class
                    </div>
                    <div
                        className="headerElement2"
                        style={{ width: 120 }}
                        onClick={this.allClasses}
                    >
                        All Classes
                    </div>
                </div>
                <div style={{ display: "inline-block", width: "90%" }}>
                    <div
                        style={{
                            width: "60%",
                            height: 800,
                            overflow: "auto",
                            border: "",
                            margin: "2% 15%",
                            padding: "1% 5%",
                            marginTop: 0,
                        }}
                    >
                        {this.state.pageBody}
                    </div>
                </div>
            </>
        );
    }
}

export default JoinClass;
