import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import blogApi from "../../api/blogApi";
import "./index.scss";

function BlogCreate() {
  const [errors, setErrors] = useState({ title: "", content: "" });
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, content, thumbnail } = e.target;

    let formData = new FormData();
    formData.append("title", title.value);
    formData.append("content", content.value);
    formData.append("thumbnail", thumbnail.files[0]);

    blogApi
      .create(formData)
      .then((res) => {
        console.log(res);
        if (res && res.msg === "success") {
          history.push("/blogs");
          return;
        }
        if (res && res.msg === "ValidatorError") {
          setErrors({
            ...errors,
            title: res.errors.title ? "*" + res.errors.title : "",
            content: res.errors.content ? "*" + res.errors.content : "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClearErrors = () => {
    setErrors({ ...errors, title: "", content: "" });
  };

  return (
    <>
      <form
        onChange={handleClearErrors}
        onSubmit={handleSubmit}
        className="blogs__create"
      >
        <TextField
          label="Title"
          name="title"
          style={{ marginBottom: 22 }}
          placeholder="Placeholder"
          helperText={errors.title}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { paddingLeft: 5, fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        <TextField
          style={{ marginBottom: 22, padding: 0 }}
          multiline
          rows={8}
          name="content"
          placeholder="Content..."
          helperText={errors.content}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{
            style: { margin: 0, padding: 0, fontSize: 15, lineHeight: 1.5 },
          }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          variant="outlined"
        />
        <label className="blogs__label">
          Item Thumbnail (accepted: JPEG, JPG, PNG)
        </label>
        <input type="file" name="thumbnail" />
        <Button
          type="submit"
          className="blogs__submit"
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </form>
    </>
  );
}

export default BlogCreate;
