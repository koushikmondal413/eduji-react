import React, { Component } from "react";
import FoundTeacher from "./foundTeacher";

class AddTeacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherSearch: false,
      teacher: {},
      token: localStorage.getItem("token"),
    };
  }
  handleTeacherSearch = () => {
    let email = document.getElementById("searchEmail").value;
    fetch(`/api/teacher/${email}`, {
      headers: { Authorization: `Bearer ${this.state.token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ teacher: data });
        this.setState({ teacherSearch: true });
      });
  };
  render() {
    let teacherFound;
    this.state.teacherSearch
      ? (teacherFound = (
          <FoundTeacher teacher={this.state.teacher} sid={this.props.sid} />
        ))
      : (teacherFound = "");
    return (
      <div className="box1">
        <div className="smallModalTitle">Connect with a teacher</div>
        <div>
          <input
            style={{ margin: 12, width: 250 }}
            className="defaultInput"
            type="text"
            placeholder="Enter Email Id"
            id="searchEmail"
          />
          <button className="defaultButton" onClick={this.handleTeacherSearch}>
            Search
          </button>
        </div>
        {teacherFound}
      </div>
    );
  }
}

export default AddTeacher;
