import React, { Component } from "react";
import "./home.css";
import TeacherDash from "./home/teacherDash";
import StudentDash from "./home/studentDash";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageBody: "all",
      pageBody: "",
    };
    this.handleAllStudentsClick = this.handleAllStudentsClick.bind(this);
    this.handleAddStudentsClick = this.handleAddStudentsClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleStudentSearch = this.handleStudentSearch.bind(this);
    this.handleConnectNow = this.handleConnectNow.bind(this);
    this.prepareDash = this.prepareDash.bind(this);
  }
  componentDidMount() {
    this.prepareDash();
  }
  handleAllStudentsClick() {
    this.setState({ pageBody: "all" });
  }
  handleAddStudentsClick() {
    this.setState({ pageBody: "add" });
  }
  handleLogoutClick() {
    this.props.handleLogoutClick();
  }
  handleStudentSearch(email) {
    this.props.handleStudentSearch(email);
  }
  handleConnectNow(email) {
    this.props.handleConnectNow(email);
  }
  prepareDash() {
    if (this.props.userType === "") {
      setInterval(() => {
        this.prepareDash();
      }, 300);
      return;
    } else if (this.props.userType === "t") {
      this.setState({
        pageBody: (
          <TeacherDash
            pageBody={this.state.pageBody}
            handleAllStudentsClick={this.handleAllStudentsClick}
            handleAddStudentsClick={this.handleAddStudentsClick}
            handleLogoutClick={this.handleLogoutClick}
            handleStudentSearch={this.handleStudentSearch}
            sid={this.props.sid}
            handleConnectNow={this.handleConnectNow}
            incoming={this.props.incoming}
            connectionStatus={this.props.connectionStatus}
            connectId={this.props.connectId}
            incomingFrom={this.props.incomingFrom}
            handleConnect={this.props.handleConnect}
            students={this.props.students}
            fetchStudents={this.props.fetchStudents}
          />
        ),
      });
    } else if (this.props.userType === "s") {
      this.setState({
        pageBody: (
          <StudentDash
            sid={this.props.sid}
            handleLogoutClick={this.handleLogoutClick}
            handleConnectNow={this.handleConnectNow}
            incoming={this.props.incoming}
            connectionStatus={this.props.connectionStatus}
            connectId={this.props.connectId}
            incomingFrom={this.props.incomingFrom}
            handleConnect={this.props.handleConnect}
            teachers={this.props.teachers}
            fetchTeachers={this.props.fetchTeachers}
          />
        ),
      });
    }
  }
  render() {
    return <div className="home">{this.state.pageBody}</div>;
  }
}

export default Home;
