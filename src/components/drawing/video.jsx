const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      let video = document.getElementById(`video${props.key}`);
      video.srcObject = stream;
    });
  }, []);

  return (
    <video id={"video" + props.key} width="200" height="180" autoplay></video>
  );
};

module.exports = Video;
