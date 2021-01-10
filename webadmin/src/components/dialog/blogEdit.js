import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../utils/muiTheme";
import "./index.scss";

function BlogEdit(props) {
  const { show, onclose, data, error, onClearError, onsubmit } = props;

  const handleCloseDialog = () => {
    if (onclose) onclose();
  };

  const handleClearError = () => {
    if (onClearError) onClearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, content, thumbnail } = e.target;
    let formData = new FormData();
    if (title.value !== "") formData.append("title", title.value);
    formData.append("content", content.value);
    formData.append("thumbnail", thumbnail.files[0]);

    if (onsubmit) onsubmit(formData, data._id);
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={show}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update Blog</DialogTitle>
        <DialogContent>
          <DialogContentText className="MuiTypography-colorTextSecondary--error">
            {error && `* ${error}`}
          </DialogContentText>
          <DialogContentText>
            Give blank field to skip updating
          </DialogContentText>
          <form onChange={handleClearError} onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              defaultValue={data && data.title}
              type="text"
              fullWidth
            />
            {/*  */}
            <TextField
              multiline
              style={{ marginBottom: 15, padding: 0 }}
              rows={5}
              margin="dense"
              name="content"
              label="Content"
              defaultValue={data && data.content}
              type="text"
              fullWidth
            />
            {/*  */}
            <label className="blogs__label">
              Item Thumbnail (accepted: JPEG, JPG, PNG)
            </label>
            <input type="file" name="thumbnail" />
            <div className="form__update__buttons">
              <Button type="submit" color="primary">
                Update
              </Button>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

export default BlogEdit;
