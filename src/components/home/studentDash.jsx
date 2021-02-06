import React, { Component } from "react";
import Teachers from "./teachers";
import AddTeacher from "./addTeacher";
import Logout from "../logout";
import Incoming from "./incoming";

class StudentDash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageBody: "all",
    };
    this.handleAddTeacherClick = this.handleAddTeacherClick.bind(this);
    this.handleAllTeachersClick = this.handleAllTeachersClick.bind(this);
  }
  componentDidMount() {
    //this.props.fetchTeachers();
  }
  handleAddTeacherClick() {
    this.setState({ pageBody: "add" });
  }
  handleAllTeachersClick() {
    this.setState({ pageBody: "all" });
  }
  render() {
    let pageBody;
    if (this.state.pageBody === "all") {
      pageBody = (
        <Teachers
          sid={this.props.sid}
          handleConnectNow={this.props.handleConnectNow}
          teachers={this.props.teachers}
        />
      );
    }
    if (this.state.pageBody === "add") {
      pageBody = <AddTeacher sid={this.props.sid} />;
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
          <div className="headerElement" onClick={this.handleAddTeacherClick}>
            Connect With A Teacher
          </div>
          <div className="headerElement" onClick={this.handleAllTeachersClick}>
            Teachers
          </div>
          <div
            style={{
              display: "inline-block",
              float: "right",
              margin: "10px 8px",
            }}
            onClick={this.handleLogoutClick}
          >
            <Logout handleLogoutClick={this.props.handleLogoutClick} />
          </div>
        </div>
        {pageBody}
        {incomingModal}
      </>
    );
  }
}

export default StudentDash;
