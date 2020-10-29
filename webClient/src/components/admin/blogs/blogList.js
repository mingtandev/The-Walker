import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  CreateButton,
} from "react-admin";

const Blogs = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="_id" />
        <DateField source="date" />
        <TextField source="writer" />
        <EditButton basePath="/blogs" />
        <DeleteButton basePath="/blogs" />
        <CreateButton basePath="/blogs" />
      </Datagrid>
    </List>
  );
};

export default Blogs;
