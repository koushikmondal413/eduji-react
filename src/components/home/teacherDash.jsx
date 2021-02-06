import React, { Component } from "react";
import AddStudent from "./addStudent";
import Students from "./students";
import Logout from "../logout";
import Incoming from "./incoming";

class TeacherDash extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    //this.props.fetchStudents();
  }
  handleAddStudentsClick = () => {
    this.props.handleAddStudentsClick();
  };
  handleAllStudentsClick = () => {
    this.props.handleAllStudentsClick();
  };
  handleLogoutClick = () => {
    this.props.handleLogoutClick();
  };
  handleStudentSearch = (email) => {
    this.props.handleStudentSearch(email);
  };
  handleConnectNow = (email) => {
    this.props.handleConnectNow(email);
  };
  render() {
    let pageBody;
    if (this.props.pageBody === "all") {
      pageBody = (
        <Students
          sid={this.props.sid}
          handleConnectNow={this.handleConnectNow}
          students={this.props.students}
        />
      );
    }
    if (this.props.pageBody === "add") {
      pageBody = (
        <AddStudent
          handleStudentSearch={this.handleStudentSearch}
          sid={this.props.sid}
        />
      );
    }
    let incomingModal;
    this.props.connectionStatus === 1
      ? (incomingModal = (
          <Incoming
            connectId={this.props.connectId}
            incomingFrom={this.props.incomingFrom}
            sid={this.props.sid}
            handleConnect={this.props.handleConnect}
          />
        ))
      : (incomingModal = "");
    console.log(this.props.incoming);
    return (
      <>
        <div className="pageHeader">
          <div className="headerElement" onClick={this.handleAddStudentsClick}>
            Connect With A Student
          </div>
          <div className="headerElement" onClick={this.handleAllStudentsClick}>
            Students
          </div>
          <div
            style={{
              display: "inline-block",
              float: "right",
              margin: "10px 8px",
            }}
            onClick={this.handleLogoutClick}
          >
            <Logout />
          </div>
        </div>
        {pageBody}
        {incomingModal}
      </>
    );
  }
}

export default TeacherDash;
