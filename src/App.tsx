import { useState } from "react";
import "./App.css";
import { Icon16PauseCircle } from "@vkontakte/icons";

function App() {
  return (
    <>
      <div className="container">
        <div className="table grey">
          <div className="table__header">
            <div className="title do">
              <Icon16PauseCircle />
              To Do
            </div>
            <div className="table__counter grey">3</div>
          </div>
        </div>
        <div />
        <div className="table blue">
          <div className="title progress">In progress</div>
        </div>
        <div className="table green">
          <div className="title done">Done</div>
        </div>
      </div>
    </>
  );
}

export default App;
