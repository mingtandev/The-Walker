import React, { Suspense } from "react";
import "./App.scss";

import { BrowserRouter as Router } from "react-router-dom";

import Notification from "./components/reduxToastr";
import Navbar from "./container/navbar";
import Loading from "./components/loading";
import Routes from "./routes";
import CustomerChat from "./components/chat";
import Footer from "./components/footer";

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

        <CustomerChat />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
