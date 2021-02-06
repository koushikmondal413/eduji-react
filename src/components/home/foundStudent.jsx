import React, { Component } from "react";

class FoundStudent extends Component {
  constructor(props) {
    super(props);
  }
  handleAddStudent = () => {
    let email = this.props.student.email;
    fetch(`/api/teacher/sid/${this.props.sid}/addstudent/${email}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ student: data });
        this.setState({ studentSearch: true });
        alert("Request Sent!");
        window.location.reload();
      });
  };
  render() {
    const foundStudent = {
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
    this.props.student.name !== "not found"
      ? (addButton = (
          <div style={{ display: "inline-block", width: "30%" }}>
            <button className="defaultButton" onClick={this.handleAddStudent}>
              Add
            </button>
          </div>
        ))
      : (addButton = "");
    return (
      <div style={foundStudent}>
        <div style={{ display: "inline-block", width: "70%" }}>
          {this.props.student.name}
        </div>
        {addButton}
      </div>
    );
  }
}

export default FoundStudent;
