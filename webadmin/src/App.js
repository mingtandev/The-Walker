import "./App.css";

import { Route, Switch } from "react-router-dom";

import Login from "./container/form/login";
import LayOut from "./container/layout";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/" component={LayOut} />
      </Switch>
    </div>
  );
}

export default App;
