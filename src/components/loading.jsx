import React from "react";

function Loading() {
    return (
        <img
            id="mainLoading"
            src={require("../images/main-loading.gif")}
            style={{ margin: "13% -8%", position: "fixed", zIndex: 20 }}
        ></img>
    );
}

export default Loading;
