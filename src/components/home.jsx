import React, { Component } from "react";
import "./home.css";
import UserThumbnail from "./home/userThumbnail";
import Teachers from "./home/teachers";
import AddTeacher from "./home/addTeacher";
import Logout from "./logout";
import Students from "./home/students";
import AddStudent from "./home/addStudent";
import { Link } from "react-router-dom";
import Incoming from "./home/incoming";
import Help from "./help";
import CreateClass from "./createClass";
import JoinClass from "./joinClass";
import ScheduleClass from "./scheduleClass";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navItems: "",
            activeComponent: "users",
            pageBody: "",
            time: "10:00",
        };
        this.refreshCreateClass = this.refreshCreateClass.bind(this);
        this.refreshJoinClass = this.refreshJoinClass.bind(this);
    }
    componentDidMount() {
        this.createNaveItems();
        this.doInitialThing();
        if (this.props.userType === "t") {
            this.createClass();
        } else {
            this.joinClass();
        }
    }
    doInitialThing = () => {
        if (this.props.userType === "") {
            setTimeout(() => {
                this.doInitialThing();
            }, 200);
            return;
        }
        if (this.props.userType === "s") {
            this.handleTeachers();
        } else if (this.props.userType === "t") {
            this.handleStudents();
        }
    };
    createNaveItems = () => {
        if (this.props.userType === "") {
            setInterval(() => {
                this.createNaveItems();
            }, 300);
            return;
        }
        if (this.props.userType === "s") {
            let navItems = (
                <>
                    <div className="headerElement2" onClick={this.handleAddTeacher}>
                        Add Teacher
                    </div>
                    <div className="headerElement2" onClick={this.handleTeachers}>
                        Teachers
                    </div>
                    <div className="headerElement2" onClick={this.joinClass}>
                        Join Class
                    </div>
                </>
            );
            this.setState({ navItems });
        } else if (this.props.userType === "t") {
            let navItems = (
                <>
                    <div className="headerElement2" onClick={this.handleAddStudent}>
                        Add Student
                    </div>
                    <div className="headerElement2" onClick={this.handleStudents}>
                        Students
                    </div>
                    <div className="headerElement2" onClick={this.createClass}>
                        Create Class
                    </div>
                    <div className="headerElement2" onClick={this.scheduleLecture}>
                        Schedule Lecture
                    </div>
                </>
            );
            this.setState({ navItems });
        }
    };
    handleTeachers = () => {
        this.setState({ activeComponent: "teachers" });
        this.setState({ pageBody: "" });
        if (!this.props.sid) {
            setTimeout(() => {
                this.handleTeachers();
            }, 300);
            return;
        }
        this.props.fetchTeachers(this.props.sid).then((data) => {
            //console.log(data);
            let teachers = (
                <Teachers
                    sid={this.props.sid}
                    handleConnectNow={this.props.handleConnectNow}
                    teachers={data}
                    handleTeachers={this.handleTeachers}
                />
            );
            this.setState({ pageBody: teachers });
        });
    };
    handleAddTeacher = () => {
        let pageBody = <AddTeacher sid={this.props.sid} />;
        this.setState({ pageBody });
    };
    handleAddFriend = () => {
        this.setState({ pageBody: "" });
    };
    handleFriends = () => {
        this.setState({ pageBody: "" });
    };
    handleAddStudent = () => {
        let pageBody = (
            <AddStudent handleStudentSearch={this.handleStudentSearch} sid={this.props.sid} />
        );
        this.setState({ pageBody });
    };
    handleStudents = () => {
        this.setState({ pageBody: "" });
        if (!this.props.sid) {
            setTimeout(() => {
                this.handleStudents();
            }, 300);
            return;
        }
        this.props.fetchStudents(this.props.sid).then((data) => {
            //console.log(data);
            let students = (
                <Students
                    sid={this.props.sid}
                    handleConnectNow={this.props.handleConnectNow}
                    students={data}
                    handleStudents={this.handleStudents}
                />
            );
            this.setState({ pageBody: students });
        });
    };
    openNotebook = () => {};
    handleHelp = () => {
        this.setState({
            pageBody: <Help sid={this.props.sid} userType={this.props.userType} />,
        });
    };
    fetchActiveStudents(sid) {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            fetch(`/api/teacher/${sid}/activestudents`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    //console.log(data.row1);
                    //this.setState({ students: data.row1 });
                    resolve(data);
                });
        });
    }
    fetchClasses(sid) {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            fetch(`/api/teacher/${sid}/getclasses`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    fetchActiveClasses(sid) {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            fetch(`/api/student/${sid}/activeclasses`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }

    createClass = async () => {
        this.setState({ pageBody: "" });
        let sid = this.props.sid;
        if (sid === "") {
            setTimeout(() => {
                this.createClass();
                return;
            }, 100);
        }
        let students = await this.fetchActiveStudents(sid);
        let classes = await this.fetchClasses(sid);
        let pageBody = (
            <CreateClass
                sid={sid}
                students={students}
                classes={classes}
                startClass={this.props.startClass}
                refreshCreateClass={this.refreshCreateClass}
            />
        );
        this.setState({ pageBody });
    };
    refreshCreateClass() {
        this.createClass();
    }

    joinClass = async () => {
        this.setState({ pageBody: "" });
        let sid = this.props.sid;
        if (sid === "") {
            setTimeout(() => {
                this.joinClass();
                return;
            }, 100);
        }
        let activeclasses = await this.fetchActiveClasses(sid);
        this.setState({ pageBody: "" });
        let pageBody = (
            <JoinClass
                activeclasses={activeclasses}
                joinClass={this.props.joinClass}
                refreshJoinClass={this.refreshJoinClass}
            />
        );
        this.setState({ pageBody });
    };
    refreshJoinClass() {
        this.joinClass();
    }
    availabelClassNames = (sid) => {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            fetch(`/api/teacher/${sid}/getclassnames`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    };
    scheduleLecture = async (e, daySelected = "Mon") => {
        this.setState({ pageBody: "" });
        let sid = this.props.sid;
        if (sid === "") {
            setTimeout(() => {
                this.joinClass();
                return;
            }, 100);
        }
        let classes = await this.availabelClassNames(sid);
        let scheduleClassesByDay = await this.fetchScheduleLectureByDay(daySelected, sid);
        let pageBody = (
            <ScheduleClass
                classes={classes}
                scheduleClassesByDay={scheduleClassesByDay}
                sid={this.props.sid}
                refreshScheduleLecture={this.refreshScheduleLecture}
                daySelected={daySelected}
            />
        );
        this.setState({ pageBody });
        //console.log(this.state.time);
    };
    fetchScheduleLectureByDay(day, sid) {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token");
            fetch(`/api/teacher/${sid}/getclassnamesbyday/${day}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    refreshScheduleLecture = (daySelected) => {
        this.scheduleLecture("", daySelected);
    };
    onTimeChange = (time) => this.setState({ time });
    render() {
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
        return (
            <div style={{ width: "100%" }}>
                <div className="pageHeader2">
                    {incomingModal}
                    <h1 className="heading2"></h1>
                    {this.state.navItems}
                    <Link to="/drawpage">
                        <div className="headerElement2" onClick={this.openNotebook}>
                            Notebook
                        </div>
                    </Link>
                    <Link to="/notes">
                        <div className="headerElement2">Notes</div>
                    </Link>
                    <Link to="/profile">
                        <div className="headerElement2">Profile</div>
                    </Link>
                    <Link to="/help" onClick={this.handleHelp}>
                        <div className="headerElement2">Help</div>
                    </Link>
                    <div
                        style={{
                            display: "inline-block",
                            float: "right",
                            margin: "6px 8px",
                        }}
                        onClick={this.handleLogoutClick}
                    >
                        <Logout handleLogoutClick={this.props.handleLogoutClick} />
                    </div>
                </div>
                <div className="pageBody2">
                    <div className="listView2">{this.state.pageBody}</div>
                </div>
            </div>
        );
    }
}

export default Home;
