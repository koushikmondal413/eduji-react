import React, { Component } from "react";
import "./notes.css";
import Note from "./note";
import { withRouter } from "react-router-dom";

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = { notesTemplate: "" };
        this.createNotesTemplate = this.createNotesTemplate.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.maximizePreviewImage = this.maximizePreviewImage.bind(this);
    }
    componentDidMount() {
        this.props.fetchNotes();
        this.createNotesTemplate();
    }
    editSingleNote = (e) => {
        //console.log(e.target.value);
    };
    deleteSingleNote = (e) => {
        let confirm = window.confirm("Are you sure?");
        if (confirm) {
            fetch(`/api/notes/${this.props.sid}/deletepage/${e.target.value}`).then((data) => {
                window.location.reload();
            });
        }
    };
    handleDeleteDocument = (e) => {
        let confirm = window.confirm("Are you sure?");
        if (confirm) {
            fetch(`/api/notes/${this.props.sid}/delete/${e.target.value}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "deleted") {
                        alert("Document Deleted!");
                        window.location.reload();
                    }
                });
        }
    };
    createNotesTemplate() {
        if (this.props.notes !== "") {
            let notes = this.props.notes;
            let notesTemplate = [];
            for (var i in notes) {
                notesTemplate.push(
                    <Note
                        i={i}
                        documentId={notes[i].documentId}
                        documentName={notes[i].documentName}
                        created={notes[i].documentCreated}
                        updated={notes[i].documentUpdated}
                        pages={notes[i].pages}
                        handlePreview={this.handlePreview}
                        editSingleNote={this.editSingleNote}
                        deleteSingleNote={this.deleteSingleNote}
                        handleDeleteDocument={this.handleDeleteDocument}
                    />
                );
            }
            this.setState({ notesTemplate });
        } else {
            setInterval(() => {
                this.createNotesTemplate();
            }, 300);
        }
    }
    handlePreview(e) {
        //console.log(e.target.value);
        fetch(`/api/notes/page/${e.target.value}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                let imagePreview = document.getElementById("imagePreview");
                imagePreview.setAttribute("src", data);
                document.getElementById("zoomInIcon").style.display = "unset";
            });
    }
    maximizePreviewImage() {
        let image = document.getElementById("imagePreview");
        //console.log(image.src);
        var myWindow = window.open("", "PreviewWindow", "width=1200,height=800");
        myWindow.moveTo(0, 0);
        myWindow.document.write(`<img src="${image.src}" alt=""/>`);
    }
    handleBack = () => {
        this.props.history.goBack();
    };
    render() {
        return (
            <div>
                <div className="pageHeader2" style={{ height: 58, paddingLeft: 0 }}>
                    <p
                        style={{ float: "left", margin: 10, cursor: "pointer" }}
                        onClick={this.handleBack}
                    >
                        <img src={require("../images/back.png")} alt="" />
                    </p>
                    <h1 className="heading1">Notes</h1>
                </div>
                <div className="pageBody1">
                    <div className="previewDiv">
                        <h4>Preview</h4>
                        <div className="imageDiv" id="imageDiv">
                            <img
                                id="imagePreview"
                                style={{
                                    width: "100%",
                                    backgroundColor: "#fff",
                                }}
                                src=""
                                alt=""
                            />
                        </div>
                        <img
                            id="zoomInIcon"
                            style={{ cursor: "pointer", display: "none" }}
                            src={require("../images/zoom-in.png")}
                            alt="zoom in"
                            onClick={this.maximizePreviewImage}
                        />
                    </div>
                    <div className="listView">{this.state.notesTemplate}</div>
                </div>
            </div>
        );
    }
}

export default withRouter(Notes);
