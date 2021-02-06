import React, { Component } from "react";

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackDiv: true,
            feedbackDivDiv: "",
            currentPage: "about",
        };
    }

    toggleFeedback = () => {
        if (!this.state.feedbackDiv) {
            this.setState({ feedbackDiv: true });
        } else {
            this.setState({ feedbackDiv: false });
        }
    };
    submitFeedback = () => {
        let message = document.getElementById("feedback").value;
        fetch(`/api/savefeedback/${this.props.sid}/${message}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                if (data.status === "saved") {
                    alert("Feedback Submitted Successfully!");
                    this.setState({ feedbackDiv: false });
                }
            });
    };
    handleMenu(menu) {
        this.setState({ currentPage: menu });
    }
    render() {
        let feedbackDiv;
        if (this.state.feedbackDiv) {
            feedbackDiv = (
                <p>
                    <textarea
                        style={{
                            width: 300,
                            height: 120,
                            boxShadow: "0px 0px 6px",
                            borderRadius: 8,
                        }}
                        name="feedback"
                        id="feedback"
                    ></textarea>
                    <br />
                    <button
                        style={{ display: "block", marginLeft: 2 }}
                        className="liteButton"
                        onClick={this.submitFeedback}
                    >
                        Submit
                    </button>
                </p>
            );
        } else {
            feedbackDiv = "";
        }
        let pageBody;
        if (this.state.currentPage === "about") {
            pageBody = (
                <div style={{ textAlign: "center" }}>
                    <h2>About</h2>
                    <p style={{ width: 500, marginLeft: "0%", display: "inline-block" }}>
                        Welcome to Eduji. This is a online platform for live teaching. By using our
                        platform you can teach or take classes. There are many options to
                        collaborate and audio, video communication With live notebook.
                    </p>
                    <p style={{ marginTop: "40%", width: 300, marginLeft: "22%" }}>
                        <p onClick={this.toggleFeedback} style={{ cursor: "pointer" }}>
                            Give feedback / Submit Queries if you have any problem.
                        </p>
                        <br />
                        {feedbackDiv}
                    </p>
                </div>
            );
        }
        if (this.state.currentPage === "howto") {
            pageBody = (
                <div>
                    <h2>How To Use The Application</h2>
                    <div style={{ textAlign: "center", padding: 40 }}>
                        <div>
                            <h3>1. Connect With a Student.</h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step1.PNG")} alt="" />
                        </div>
                        <div>
                            <h3>2. Enter Email of the Student you want to add.</h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step2.PNG")} alt="" />
                        </div>
                        <div>
                            <h3>
                                3. Search, If Email is valid and student is registerd with up, click
                                add.
                            </h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step3.PNG")} alt="" />
                        </div>
                        <div>
                            <h3>4. A request will be sent to user.</h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step4.PNG")} alt="" />
                        </div>
                        <div>
                            <h3>5. Ask the user to add.</h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step5.PNG")} alt="" />
                        </div>
                        <div>
                            <h3>6. Step 6.</h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step6.PNG")} alt="" />
                        </div>
                        <div>
                            <h3>7. Step 7.</h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step7.PNG")} alt="" />
                        </div>
                        <div>
                            <h3>8. Step 8.</h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step8.PNG")} alt="" />
                        </div>
                        <div>
                            <h3>8. Step 9.</h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step9.PNG")} alt="" />
                        </div>
                        <div>
                            <h3>
                                8. Step 10. After class started students can see the class on their
                                page and join.
                            </h3>
                            <p></p>
                            <img src={require("../images/howtoscreenshots/step10.PNG")} alt="" />
                        </div>
                    </div>
                </div>
            );
        }
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
                        onClick={() => this.handleMenu("about")}
                    >
                        About
                    </div>
                    <div
                        className="headerElement2"
                        style={{ width: 120 }}
                        onClick={() => this.handleMenu("howto")}
                    >
                        How TO
                    </div>
                </div>
                <div style={{ display: "inline-block", marginLeft: -94 }}>{pageBody}</div>
            </>
        );
    }
}

export default Help;
