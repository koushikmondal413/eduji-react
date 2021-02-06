import React, { Component } from "react";

class CreateClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "classes",
            studentsDiv: [],
            selectedStudents: [],
            classes: [],
        };
        this.selectStudent = this.selectStudent.bind(this);
        this.deleteClass = this.deleteClass.bind(this);
        this.showStudentInClass = this.showStudentInClass.bind(this);
    }
    componentDidMount() {
        this.classes();
    }
    createClass = () => {
        this.setState({ activeTab: "create class" });
        //console.log(this.props.students);
        let students = this.props.students;

        let studentsDiv = [];
        for (var i in students) {
            let name = students[i].name;
            let email = students[i].email;
            studentsDiv.push(
                <div
                    style={{
                        margin: "12px 60px",
                        border: "1px solid #d5ec78",
                        color: "white",
                    }}
                    key={i}
                >
                    <div
                        style={{
                            width: "10%",
                            display: "inline-block",
                            verticalAlign: "super",
                        }}
                    >
                        <input
                            type="checkbox"
                            value={email}
                            id={`student_${i}`}
                            onClick={this.selectStudent}
                        />
                    </div>
                    <div style={{ width: "90%", display: "inline-block" }}>
                        <p>{name}</p>
                        <p>{email}</p>
                    </div>
                </div>
            );
        }
        this.setState({ studentsDiv });
    };
    classes = () => {
        this.setState({ activeTab: "classes" });
        let classes = this.props.classes.classes;
        let classesDiv = [];
        if (!classes) return;
        if (classes.length === 0) {
            classesDiv = "No Classes, Create a Class.";
        } else {
            classesDiv.push(
                <>
                    <h4>Classes</h4>
                    <br />
                </>
            );
            for (let i in classes) {
                let students = [];
                for (let j in classes[i].students) {
                    students.push(
                        <div style={{ padding: 4, color: "#d0d07f" }}>
                            <p style={{ margin: 0 }}>Name : {classes[i].students[j].name}</p>
                            <p style={{ margin: 0 }}>Email : {classes[i].students[j].email}</p>
                        </div>
                    );
                }
                classesDiv.push(
                    <div
                        style={{
                            border: "1px solid yellow",
                            borderRadius: 2,
                            margin: "1% 10%",
                            textAlign: "left",
                        }}
                    >
                        <div style={{ width: "70%", display: "inline-block", color: "white" }}>
                            <div style={{ padding: 20, display: "inline-block", width: "54%" }}>
                                {classes[i].className}
                            </div>
                            <div
                                id={"confType_" + classes[i].id}
                                style={{
                                    padding: 20,
                                    display: "inline-block",
                                    width: "16%",
                                    color: "#8dea8d",
                                }}
                            >
                                {classes[i].confType === 1 ? "Audio" : "Video"}
                            </div>
                            <div
                                style={{
                                    padding: 20,
                                    display: "inline-block",
                                    width: "30%",
                                }}
                            >
                                <span
                                    style={{
                                        color: "#4eb8d8",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => this.showStudentInClass("cs_" + classes[i].id)}
                                >
                                    Students
                                </span>
                            </div>
                        </div>
                        <div style={{ width: "30%", display: "inline-block" }}>
                            <button
                                className="liteButton"
                                style={{ minHeight: 28, minWidth: 60, margin: "0px 4px" }}
                                onClick={this.props.startClass}
                                value={classes[i].id}
                            >
                                Start
                            </button>
                            <button
                                className="liteButton"
                                style={{ minHeight: 28, minWidth: 60 }}
                                onClick={this.deleteClass}
                                value={classes[i].id}
                            >
                                delete
                            </button>
                        </div>
                        <div
                            style={{
                                width: "100%",
                                maxHeight: 300,
                                overflow: "auto",
                                padding: "4px 4px 4px 32px",
                                display: "none",
                            }}
                            id={"cs_" + classes[i].id}
                        >
                            <div
                                style={{
                                    display: "inline-block",
                                    verticalAlign: "top",
                                    marginRight: 4,
                                    width: "70%",
                                }}
                            >
                                {students}
                            </div>
                            <div
                                style={{
                                    display: "inline-block",
                                    verticalAlign: "top",
                                    color: "white",
                                }}
                            ></div>
                        </div>
                    </div>
                );
            }
        }
        this.setState({ classes: classesDiv });
    };
    selectStudent(e) {
        if (e.target.checked) {
            let selectedStudents = this.state.selectedStudents;
            selectedStudents.push(e.target.value);
            this.setState({ selectedStudents });
        } else {
            let selectedStudents = this.state.selectedStudents;
            selectedStudents.splice(selectedStudents.indexOf(e.target.value), 1);
            this.setState({ selectedStudents });
        }
    }
    saveClass = () => {
        document.getElementById("saveClassB").setAttribute("disabled", true);
        //console.log(this.state.selectedStudents);
        let className = document.getElementById("classNameInput");
        let confType = document.getElementById("selectConferenceType");
        if (className.value === "") {
            alert("Please Enter class name.");
            className.focus();
            return;
        }
        let token = localStorage.getItem("token");
        let selectedStudents = this.state.selectedStudents;
        let sid = this.props.sid;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                students: selectedStudents,
                className: className.value,
                confType: confType.value,
            }),
        };
        fetch(`/api/teacher/${sid}/createclass`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "created") {
                    alert("Class created.");
                    this.props.refreshCreateClass();
                } else if (data.status === "exist") {
                    alert("Class already exist, try using a diffrent name.");
                }
            });
    };
    deleteClass(e) {
        let token = localStorage.getItem("token");
        let classId = e.target.value;
        let sid = this.props.sid;
        fetch(`/api/teacher/${sid}/removeclass/${classId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "deleted") {
                    alert("Class Deleted.");
                    this.props.refreshCreateClass();
                }
            });
    }
    showStudentInClass(id) {
        let div = document.getElementById(id);
        if (div.style.display === "block") {
            div.style.display = "none";
        } else {
            div.style.display = "block";
        }
    }
    render() {
        let pageBody;
        if (this.state.activeTab === "create class") {
            pageBody = (
                <div>
                    <div
                        style={{
                            width: "42%",
                            display: "inline-block",
                            height: 520,
                            margin: "2%",
                            border: "1px solid rgb(85, 125, 134)",
                            verticalAlign: "top",
                            boxShadow: "0px 0px 5px #4e4949 inset",
                            borderRadius: 4,
                            padding: "1% 2%",
                        }}
                    >
                        <h4>Select Students</h4>
                        <div style={{ overflow: "auto" }}>{this.state.studentsDiv}</div>
                        <br />
                    </div>
                    <div
                        style={{
                            width: "42%",
                            display: "inline-block",
                            height: 520,
                            margin: "2%",
                            border: "1px solid rgb(85, 125, 134)",
                            boxShadow: "0px 0px 5px #4e4949 inset",
                            borderRadius: 4,
                            padding: 50,
                        }}
                    >
                        <label htmlFor="" style={{ color: "white" }}>
                            Students Selected {this.state.selectedStudents.length}
                        </label>
                        <br /> <br />
                        <label htmlFor="classNameInput">Class Name</label> <br />
                        <br />
                        <input
                            type="text"
                            className="defaultInput"
                            name="classNameInput"
                            id="classNameInput"
                            style={{ boxShadow: "0px 0px 5px #abb1b9" }}
                        />
                        <br />
                        <br />
                        <br />
                        <div>
                            <label htmlFor="selectConferenceType">Conference Type</label>
                            <select
                                style={{
                                    width: 80,
                                    marginLeft: 10,
                                    boxShadow: "0px 0px 5px #abb1b9",
                                }}
                                id="selectConferenceType"
                                className="defaultInput"
                            >
                                <option value="1">Audio</option>
                                <option value="2">Video</option>
                            </select>
                        </div>
                        <br />
                        <br />
                        <br />
                        <button className="liteButton" onClick={this.saveClass} id="saveClassB">
                            Save Class
                        </button>
                        <br />
                        <br />
                    </div>
                </div>
            );
        } else if (this.state.activeTab === "classes") {
            pageBody = (
                <div
                    style={{
                        width: "60%",
                        height: 800,
                        overflow: "auto",
                        border: "",
                        margin: "2% 15%",
                        padding: "1% 5%",
                        marginTop: 0,
                    }}
                >
                    {this.state.classes}
                </div>
            );
        }
        return (
            <>
                <div
                    style={{
                        width: 120,
                        height: 900,
                        display: "inline-block",
                        float: "left",
                    }}
                >
                    <div
                        className="headerElement2"
                        style={{ width: 120 }}
                        onClick={this.createClass}
                    >
                        Create Class
                    </div>
                    <div className="headerElement2" style={{ width: 120 }} onClick={this.classes}>
                        Classes
                    </div>
                </div>
                <div style={{ display: "inline-block", width: "90%" }}>{pageBody}</div>
            </>
        );
    }
}

export default CreateClass;
