import React from "react";
import Sidebar from "./Sidebar";

function Credit() {
  return (
    <div id="outer-container">
      <Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <div id="page-wrap">
        <center>
          <h1>Credit Page</h1>
        </center>
        <ol>
          <li>นางสาวศุภาเพ็ญ​ แก้วลี</li>
          <li>นางสาวสุภาพร จารัตน์</li>
          <li>นางสาวอรจิรา แกล้วเดชศรี</li>
          <li>นางสาวอรุษา ธนโกไสย</li>
        </ol>
      </div>
    </div>
  );
}

export default Credit;
