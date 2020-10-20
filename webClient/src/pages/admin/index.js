import React from "react";
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { createHashHistory } from "history";
import Home from "../../components/home";

function AdminPage() {
  const history = createHashHistory();
  const authProvider = () => Promise.resolve();

  return (
    <div className="admin">
      <Admin
        authProvider={authProvider}
        history={history}
        dataProvider={simpleRestProvider(process.env.REACT_APP_BASE_URL)}
        title="My Admin"
      >
        <Resource name="users" list={Home} />
      </Admin>
    </div>
  );
}

export default AdminPage;
