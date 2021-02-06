import React, { Component } from "react";
import FoundStudent from "./foundStudent";

class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentSearch: false,
      student: {},
      token: localStorage.getItem("token"),
    };
  }
  handleStudentSearch = () => {
    let email = document.getElementById("searchEmail").value;
    fetch(`/api/student/${email}`, {
      headers: { Authorization: `Bearer ${this.state.token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ student: data });
        this.setState({ studentSearch: true });
      });
  };
  render() {
    let studentFound;
    this.state.studentSearch
      ? (studentFound = (
          <FoundStudent student={this.state.student} sid={this.props.sid} />
        ))
      : (studentFound = "");
    return (
      <div className="box1">
        <div className="smallModalTitle">Connect with a student</div>
        <div>
          <input
            style={{ margin: 12, width: 250 }}
            className="defaultInput"
            type="text"
            placeholder="Enter Email Id"
            id="searchEmail"
          />
          <button className="defaultButton" onClick={this.handleStudentSearch}>
            Search
          </button>
        </div>
        {studentFound}
      </div>
    );
  }
}

export default AddStudent;
