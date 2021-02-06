import Peer from "simple-peer";

class Peer1 {
  constructor(initiator, stream, socket, divice) {
    this.initiator = initiator;
    this.stream = stream;
    this.socket = socket;
    this.device = this.device;
  }
  getPeer() {
    let peer = new Peer({
      initiator: this.peerInitiator,
      stream: this.stream,
    });
    peer.on("signal", (data) => {
      //console.log("signal", data);
      this.socket.emit("offer", data);
    });
    this.socket.on("offer", (data) => {
      peer.signal(data);
    });
    peer.on("connect", () => {
      console.log("connected");
    });
    peer.on("stream", (stream) => {
      if (this.device == "video") {
        var video = document.createElement("video");
        video.style.width = "100px";
        document.getElementById("videoDiv").appendChild(video);
        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream); // for older browsers
        }
        video.play();
      } else {
        var audio = document.createElement("audio");
        audio.style.width = "100px";
        document.getElementById("videoDiv").appendChild(audio);
        if ("srcObject" in audio) {
          audio.srcObject = stream;
        } else {
          audio.src = window.URL.createObjectURL(stream); // for older browsers
        }
        audio.play();
      }
    });
    this.socket.on("audio disconnect", (data) => {
      var track = this.stream.getAudioTracks()[0]; // if only one media track
      // ...
      track.stop();
    });
    this.socket.on("video disconnect", (data) => {
      var track = this.stream.getVideoTracks()[0]; // if only one media track
      // ...
      track.stop();
      //this.state.peer.destroy();
    });
    return peer;
  }
}

export default Peer1;
