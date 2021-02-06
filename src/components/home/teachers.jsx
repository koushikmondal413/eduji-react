import React, { Component } from "react";

class Teachers extends Component {
    constructor(props) {
        super(props);

        this.handleAcceptTeacherClick = this.handleAcceptTeacherClick.bind(this);
        this.handleConnectNow = this.handleConnectNow.bind(this);
    }

    handleConnectNow(e) {
        let buttons = document.querySelectorAll("[class*=defaultButton]");
        //console.log(buttons);
        buttons.forEach((e) => {
            e.setAttribute("disabled", "disabled");
        });
        let email = e.target.value;
        this.props.handleConnectNow(email);
    }
    handleAcceptTeacherClick(e) {
        console.log(e.target.value);
        fetch(`/api/student/${this.props.sid}/accept_teacher/${e.target.value}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                alert(data.message);
                this.props.handleTeachers();
            });
    }
    addButton(value) {
        return (
            <button value={value} className="defaultButton" onClick={this.handleAcceptTeacherClick}>
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
        fetch(`/api/student/${this.props.sid}/removeteacher/${e.target.value}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                if (data.status === "removed") {
                    alert("Removed!");
                }
                this.props.handleTeachers();
            });
    };
    render() {
        let addButton;
        let connectNowButton;
        let teachers = [];
        //console.log(this.props.teachers);
        for (var i in this.props.teachers) {
            //console.log(this.state.teachers[i]);
            if (this.props.teachers[i].initBy === "t") {
                if (this.props.teachers[i].added === "s") {
                    addButton = "";
                    connectNowButton = this.connectNowButton(this.props.teachers[i].email);
                } else {
                    addButton = this.addButton(this.props.teachers[i].email);
                    connectNowButton = "";
                }
            }
            if (this.props.teachers[i].initBy === "s") {
                if (this.props.teachers[i].added === "t") {
                    addButton = "";
                    connectNowButton = this.connectNowButton(this.props.teachers[i].email);
                } else {
                    addButton = "Not yet added by Teacher";
                    connectNowButton = "";
                }
            }
            teachers.push(
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
                        <p>{this.props.teachers[i].name}</p>
                        <p>{this.props.teachers[i].email}</p>
                    </div>
                    <div style={{ display: "inline-block", width: "30%" }}>
                        {addButton}
                        <button
                            style={{ margin: 5 }}
                            value={this.props.teachers[i].email}
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
                <div className="box2Title">Teachers</div>
                <div>{teachers}</div>
            </div>
        );
    }
}

export default Teachers;
