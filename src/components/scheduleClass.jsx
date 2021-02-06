import React, { Component } from "react";

class ScheduleClass extends Component {
    state = {
        days: {
            Mon: "Monday",
            Tue: "Tuesday",
            Wed: "Wednesday",
            Thu: "Thurseday",
            Fri: "Friday",
            Sat: "Saturday",
            Sun: "Sunday",
        },
    };

    saveSchedule = () => {
        document.getElementById("saveScheduleB").setAttribute("disabled", true);
        let sid = this.props.sid;
        let token = localStorage.getItem("token");
        let daySelected = document.getElementById("daySelected");
        let classIdSelected = document.getElementById("classIdSelected");
        let timeSelected = document.getElementById("timeSelected");
        if (classIdSelected.value === "") {
            alert("Please select a class.");
            classIdSelected.focus();
            return;
        }
        if (timeSelected.value === "") {
            alert("Please select time.");
            timeSelected.focus();
            return;
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                day: daySelected.value,
                classId: classIdSelected.value,
                time: timeSelected.value,
            }),
        };
        fetch(`/api/teacher/${sid}/createschedule`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.props.refreshScheduleLecture(daySelected.value);
            });
    };
    deletechedule = (e) => {
        let c = window.confirm("Are you sure?");
        if (!c) return;
        let sid = this.props.sid;
        let token = localStorage.getItem("token");
        let daySelected = document.getElementById("daySelected");
        fetch(`/api/teacher/${sid}/removeschedule/${e.target.value}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.refreshScheduleLecture(daySelected.value);
            });
    };

    render() {
        let classes = this.props.classes;
        let scheduleClassesByDay = this.props.scheduleClassesByDay;
        let daySelectedFromProp = this.props.daySelected;
        let days = this.state.days;
        let dayOptions = [];
        let scheduledClasses = [];

        //console.log(this.props.scheduleClassesByDay);

        for (let l in days) {
            if (l === daySelectedFromProp) {
                dayOptions.push(
                    <option selected value={l}>
                        {days[l]}
                    </option>
                );
            } else {
                dayOptions.push(<option value={l}>{days[l]}</option>);
            }
        }
        let classesOptions = [];
        classesOptions.push(<option value=""></option>);
        //console.log(classes);
        for (let k in classes) {
            classesOptions.push(<option value={classes[k].id}>{classes[k].className}</option>);
        }
        let time;
        let h, m1, h1;
        for (let m in scheduleClassesByDay) {
            time = scheduleClassesByDay[m].time.split(":");
            h = time[0];
            m1 = time[1];
            if (parseInt(h) - 12 < 0) {
                time = h + ":" + m1 + " AM";
            } else {
                h1 = parseInt(h) - 12;
                if (h1 === 0) h1 = 12;
                time = h1 + ":" + m1 + " PM";
            }

            scheduledClasses.push(
                <div style={{ paddingBottom: 20 }}>
                    <div
                        style={{
                            display: "inline-block",
                            verticalAlign: "top",
                            textAlign: "left",
                        }}
                    >
                        <label style={{ color: "#d8d0d0" }} htmlFor="classIdSelected">
                            Class
                        </label>
                        <br />
                        <input
                            className="defaultInput"
                            readOnly
                            type="text"
                            value={scheduleClassesByDay[m].className}
                            style={{ boxShadow: "none", backgroundColor: "aliceblue" }}
                        />
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                            verticalAlign: "top",
                            textAlign: "left",
                            marginLeft: 40,
                        }}
                    >
                        <label style={{ color: "#d8d0d0" }} htmlFor="classIdSelected">
                            Time
                        </label>
                        <br />
                        <input
                            className="defaultInput"
                            style={{ width: 80, boxShadow: "none", backgroundColor: "aliceblue" }}
                            readOnly
                            type="text"
                            value={time}
                        />
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                            verticalAlign: "top",
                            marginLeft: 40,
                            paddingTop: 24,
                        }}
                    >
                        <button
                            style={{ minHeight: 37 }}
                            className="liteButton"
                            value={scheduleClassesByDay[m].id}
                            onClick={this.deletechedule}
                        >
                            delete
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div style={{ width: "80%", marging: "10%" }}>
                <div
                    style={{
                        width: "30%",
                        margin: "5%",
                        display: "inline-block",
                        verticalAlign: "top",
                    }}
                >
                    <select
                        className="defaultInput"
                        name="daySelected"
                        id="daySelected"
                        onChange={(e) => this.props.refreshScheduleLecture(e.target.value)}
                    >
                        {dayOptions}
                    </select>
                </div>
                <div
                    style={{
                        width: "50%",
                        margin: "5%",
                        display: "inline-block",
                        verticalAlign: "top",
                    }}
                >
                    <div>{scheduledClasses}</div>
                    <div>
                        <div
                            style={{
                                display: "inline-block",
                                verticalAlign: "top",
                                textAlign: "left",
                            }}
                        >
                            <label style={{ color: "white" }} htmlFor="classIdSelected">
                                Select Class
                            </label>
                            <br />

                            <select
                                className="defaultInput"
                                name="classIdSelected"
                                id="classIdSelected"
                            >
                                {classesOptions}
                            </select>
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                verticalAlign: "top",
                                marginLeft: 40,
                                textAlign: "left",
                            }}
                        >
                            <label style={{ color: "white" }} htmlFor="timeSelected">
                                Time
                            </label>
                            <br />
                            <input
                                className="defaultInput"
                                style={{ width: 80 }}
                                type="time"
                                id="timeSelected"
                            />
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                verticalAlign: "top",
                                marginLeft: 40,
                                paddingTop: 24,
                            }}
                        >
                            <button
                                style={{ minHeight: 37 }}
                                className="liteButton"
                                onClick={this.saveSchedule}
                                id="saveScheduleB"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScheduleClass;
