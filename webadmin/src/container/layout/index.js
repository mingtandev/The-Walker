import React, { useState } from "react";
import Header from "../header";
import Content from "../content";
import Sidebar from "../sidebar";
import "./index.scss";

function LayOut() {
  const [sidebarShow, setSidebarShow] = useState(true);

  const onToggleSidebar = () => {
    setSidebarShow((prevState) => !prevState);
  };

  return (
    <>
      <Header onToggleSidebar={onToggleSidebar} />
      <div className="layout__main">
        <Sidebar show={sidebarShow} />
        <div className={sidebarShow ? "wrapper" : "wrapper--fullscreen"}>
          <Content />
        </div>
      </div>
    </>
  );
}

export default LayOut;
