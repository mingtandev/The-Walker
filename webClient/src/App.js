import React, { Suspense } from "react";
import "./App.scss";

import { HashRouter as Router } from "react-router-dom";

import Notification from "./components/reduxToastr";
import Navbar from "./container/navbar";
import Loading from "./components/loading";
import Routes from "./routes";

function App() {
  return (
    <div>
      <div className="app">
        <Notification />
        <Suspense fallback={<Loading />}>
          <Router>
            <Routes />
            <Navbar />
          </Router>
        </Suspense>
      </div>
      <div className="footer">
        <span>A project in Introduction to Software Engineering</span>
        <span>
          <span className="footer__contact">CONTACT US: </span>
          <a
            className="footer__icon"
            href="https://www.facebook.com/ReferenceToWorld"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fab fa-facebook"></i>
          </a>
          <a
            className="footer__icon"
            href="https://www.facebook.com/messages/t/ReferenceToWorld"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fab fa-facebook-messenger"></i>
          </a>
        </span>
      </div>
    </div>
  );
}

export default App;
