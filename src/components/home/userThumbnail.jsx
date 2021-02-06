import React, { Component } from "react";
import "./userThumbnail.css";
import "../../bootstrap/css/bootstrap.min.css";

class UserThumbnail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagesOpen: false,
      pagesTemplate: [],
    };
    this.togglePages = this.togglePages.bind(this);
  }
  componentDidMount() {
    this.createPagesTemplate();
  }
  convertTimestampToDate(timestamp) {
    let tarr = timestamp.split("T");
    let t1 = tarr[0];
    return t1;
  }
  togglePages(i) {
    //let i = e.target.id;
    let pagesDiv = document.getElementById(`page${i}`);
    if (!pagesDiv) return;
    if (this.state.pagesOpen) {
      this.setState({ pagesOpen: false });
      pagesDiv.style.display = "none";
    } else {
      this.setState({ pagesOpen: true });
      pagesDiv.style.display = "block";
    }
  }

  createPagesTemplate() {
    if (this.props.pages) {
      let pages = this.props.pages;
      let pagesTemplate = [];
      for (var i in pages) {
        pagesTemplate.push(
          <div className="pageDiv">
            <p>{pages[i].pageTitle}</p>
            <div style={{ display: "inline-block", width: "60%" }}>
              <p>Created: {this.convertTimestampToDate(pages[i].created)}</p>
              <p>Updated: {this.convertTimestampToDate(pages[i].updated)}</p>
            </div>
            <div style={{ display: "inline-block", width: "40%" }}>
              <button
                value={pages[i].id}
                className="defaultButton"
                onClick={this.props.handlePreview}
              >
                View
              </button>
              <button value={pages[i].id} className="defaultButton">
                Edit
              </button>
            </div>
          </div>
        );
      }
      this.setState({ pagesTemplate });
    }
  }
  render() {
    let icon;
    this.state.pagesOpen
      ? (icon = "glyphicon glyphicon-chevron-right")
      : (icon = "glyphicon glyphicon-chevron-down");
    return (
      <div className="noteDiv">
        <p>{this.props.documentName}</p>
        <div style={{ display: "inline-block", width: "60%" }}>
          <p>Created: {this.convertTimestampToDate(this.props.created)}</p>
          <p>Updated: {this.convertTimestampToDate(this.props.updated)}</p>
        </div>
        <div style={{ display: "inline-block", width: "40%" }}>
          <button value={this.props.documentId} className="defaultButton">
            View
          </button>
          <button value={this.props.documentId} className="defaultButton">
            Edit
          </button>
        </div>
        <p
          style={{ cursor: "pointer" }}
          id={this.props.i}
          onClick={() => {
            this.togglePages(this.props.i);
          }}
        >
          <br />
          Pages <span className={icon}></span>
        </p>
        <div
          className="pagesDiv"
          style={{ display: "none" }}
          id={`page${this.props.i}`}
        >
          {this.state.pagesTemplate}
        </div>
      </div>
    );
  }
}

export default UserThumbnail;
