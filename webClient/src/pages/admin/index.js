import React from "react";
import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { createHashHistory } from "history";
import BlogList from "../../components/admin/blogs/blogList";
import BlogCreate from "../../components/admin/blogs/blogCreate";
import ItemList from "../../components/admin/items/itemList";

function AdminPage() {
  const history = createHashHistory();
  const authProvider = () => Promise.resolve();

  return (
    <div className="admin">
      <Admin
        authProvider={authProvider}
        history={history}
        dataProvider={jsonServerProvider(
          "https://jsonplaceholder.typicode.com"
        )}
        title="My Admin"
      >
        <Resource name="blogs" list={BlogList} create={BlogCreate} />
        <Resource name="photos" list={ItemList} />
      </Admin>
    </div>
  );
}

export default AdminPage;
