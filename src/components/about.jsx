import React, { Component } from "react";

class About extends Component {
    state = {};
    componentDidMount() {
        document.body.style.backgroundColor = "white";
    }
    render() {
        return (
            <div style={{ minWidth: 1366 }}>
                <div
                    style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: 60,
                    }}
                >
                    <h1
                        style={{
                            fontSize: 60,
                            fontWeight: 600,
                            color: "#31708f",
                            fontFamily: "cursive",
                            padding: "40px 0px",
                        }}
                    >
                        Eduji
                    </h1>
                </div>
                <div
                    style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: 60,
                        backgroundColor: "white",
                        boxShadow: "0px 0px 2px #ccc",
                        fontSize: 15,
                        padding: "60px 0px",
                    }}
                >
                    <h2 style={{ paddingTop: 30 }}>About</h2>
                    <p style={{ width: "60%", margin: "30px 20%", paddingBottom: 30 }}>
                        Eduji is a online platform for tearing down the limits of physical
                        boundaries in education.It is unfortunate that the current situation around
                        the Globe right now is out of ordinary that we will get over with in a
                        matter of time, despite that there is a crisis in India and possibly in
                        other courtries as proper education is not accesscible to everyone. Here at
                        eduji we are taking a towards to future of education. Here at Eduji we try
                        to bring a futuristic touch to our traditional teaching sytem. This will be
                        same teaching and class rooms as we all experienced but thanks to the modern
                        technology which is advancing so fast there need not be physical boundaries
                        which can stop learning because that is one of the most important thing
                        India and the world needs right now. At Eduji we are trying to do just that.
                    </p>
                </div>
                <div
                    style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: 100,
                        backgroundColor: "white",
                        boxShadow: "0px 0px 2px #ccc",
                        fontSize: 15,
                        padding: "60px 0px",
                    }}
                >
                    <h2 style={{ paddingTop: 30 }}>How It Works</h2>
                    <p style={{ width: "60%", margin: "30px 20%", paddingBottom: 30 }}>
                        We connect teachers and students from everywhere. They just need a Internet
                        connection which more sophisticated as ever and an electronics device. It is
                        as easy as just singing up and creating a class and your virtual class room
                        is ready. We tried to bring some actual features we have in real class
                        rooms.There are many ways of communication as well you choose your which is
                        you prefered. And a class can have as many students as you want. Sign up now
                        to try out the application and features.
                    </p>
                </div>
                <div style={{ width: "100%", textAlign: "center", padding: "5%" }}>
                    <h3>
                        <a href="/signup">Signup</a>&nbsp;&nbsp;<a href="/login">Login</a>
                    </h3>
                </div>
                <div style={{ width: "100%", textAlign: "right", paddingRight: "5%" }}>
                    <img src={require("../images/eduji-logo.png")} alt="" />
                </div>
            </div>
        );
    }
}

export default About;
