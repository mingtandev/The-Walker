import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import blogApi from "../../api/blogApi";
import jwt_decode from "jwt-decode";
import "./index.scss";

function BlogCreate() {
  const [errors, setErrors] = useState({ title: "", content: "" });
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    const { title, content, thumbnail } = e.target;
    console.log(title.value, content.value, thumbnail.files[0]);

    let formData = new FormData();
    formData.append(
      "writer",
      localStorage.getItem("token")
        ? jwt_decode(localStorage.getItem("token"))._id
        : null
    );
    formData.append("title", title.value);
    formData.append("content", content.value);
    formData.append("thumbnail", thumbnail.files[0]);
    console.log(formData);

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
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        <TextField
          style={{ marginBottom: 22 }}
          multiline
          rows={5}
          name="content"
          helperText={errors.content}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15, lineHeight: 1.5 } }} // font size of input text
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
