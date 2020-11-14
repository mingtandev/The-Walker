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

const ItemList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        {/* <EditButton basePath="/blogs" />
        <DeleteButton basePath="/blogs" />
        <CreateButton basePath="/blogs" /> */}
      </Datagrid>
    </List>
  );
};

export default ItemList;
