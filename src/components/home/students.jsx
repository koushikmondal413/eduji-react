import React, { Component } from "react";
import "../home.css";
import io from "socket.io-client";

class Students extends Component {
    constructor(props) {
        super(props);

        this.handleAcceptStudentClick = this.handleAcceptStudentClick.bind(this);
        this.handleConnectNow = this.handleConnectNow.bind(this);
    }
    handleConnectNow(e) {
        let buttons = document.querySelectorAll("[class*=defaultButton]");
        //console.log(buttons);
        buttons.forEach((e) => {
            e.setAttribute("disabled", "disabled");
        });
        //return;
        let email = e.target.value;
        this.props.handleConnectNow(email);
    }
    handleAcceptStudentClick(e) {
        //console.log(e.target.value);
        fetch(`/api/teacher/${this.props.sid}/accept_student/${e.target.value}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data.message);
                alert(data.message);
                this.props.handleStudents();
            });
    }
    addButton(value) {
        return (
            <button value={value} className="defaultButton" onClick={this.handleAcceptStudentClick}>
                Add
            </button>
        );
    }
    connectNowButton(value) {
        return (
            <button value={value} className="defaultButton" onClick={this.handleConnectNow}>
                Connect Now
            </button>
        );
    }
    handleRemove = (e) => {
        let confirm = window.confirm("Are you sure want to remove?");
        if (!confirm) {
            return;
        }
        fetch(`/api/teacher/${this.props.sid}/removestudent/${e.target.value}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                if (data.status === "removed") {
                    alert("Removed!");
                }
                this.props.handleStudents();
            });
    };
    render() {
        let addButton;
        let connectNowButton;
        let students = [];
        for (var i in this.props.students) {
            //console.log(this.state.students[i]);
            if (this.props.students[i].initBy === "t") {
                if (this.props.students[i].added === "s") {
                    addButton = "";
                    connectNowButton = this.connectNowButton(this.props.students[i].email);
                } else {
                    addButton = "Not yet added by Student";
                    connectNowButton = "";
                }
            }
            if (this.props.students[i].initBy === "s") {
                if (this.props.students[i].added === "t") {
                    addButton = "";
                    connectNowButton = this.connectNowButton(this.props.students[i].email);
                } else {
                    addButton = this.addButton(this.props.students[i].email);
                    connectNowButton = "";
                }
            }
            students.push(
                <div
                    style={{
                        border: "1px solid #7dc0c3",
                        width: "40%",
                        margin: "6px 30%",
                        borderRadius: 4,
                    }}
                >
                    <div
                        style={{
                            display: "inline-block",
                            width: "70%",
                            color: "aliceblue",
                        }}
                    >
                        <p>{this.props.students[i].name}</p>
                        <p>{this.props.students[i].email}</p>
                    </div>
                    <div style={{ display: "inline-block", width: "30%" }}>
                        {addButton}
                        <button
                            style={{ margin: 5 }}
                            value={this.props.students[i].email}
                            className="defaultButton"
                            onClick={this.handleRemove}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div className="">
                <div className="box2Title">Students</div>
                <div>{students}</div>
            </div>
        );
    }
}

export default Students;
