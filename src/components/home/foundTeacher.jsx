import React, { Component } from "react";

class FoundTeacher extends Component {
  constructor(props) {
    super(props);
  }
  handleAddTeacher = () => {
    let email = this.props.teacher.email;
    fetch(`/api/student/sid/${this.props.sid}/addteacher/${email}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ teacher: data });
        this.setState({ teacherSearch: true });
        alert("Request Sent!");
        window.location.reload();
      });
  };
  render() {
    const foundTeacher = {
      width: "75%",
      height: "16%",
      margin: "10%",
      padding: "2%",
      border: "1px solid #a5d0d4",
      borderRadius: "8px",
      background: "#c3e0df",
      boxShadow: "1px 1px 2px #ccc, 1px 1px 1px #ccc inset",
    };
    let addButton;
    this.props.teacher.name !== "not found"
      ? (addButton = (
          <div style={{ display: "inline-block", width: "30%" }}>
            <button className="defaultButton" onClick={this.handleAddTeacher}>
              Add
            </button>
          </div>
        ))
      : (addButton = "");
    return (
      <div style={foundTeacher}>
        <div style={{ display: "inline-block", width: "70%" }}>
          {this.props.teacher.name}
        </div>
        {addButton}
      </div>
    );
  }
}

export default FoundTeacher;
