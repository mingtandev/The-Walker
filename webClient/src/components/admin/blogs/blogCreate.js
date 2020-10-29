import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  FileInput,
} from "react-admin";

const PostCreate = (props) => {
  return (
    <Create title="Create a Post" {...props}>
      <SimpleForm>
        <TextInput source="title" />
        <TextInput source="writer" />
        <TextInput multiline source="content" />
        <FileInput label="Blog Thumbnail" source="thumbnail" />
      </SimpleForm>
    </Create>
  );
};

export default PostCreate;
