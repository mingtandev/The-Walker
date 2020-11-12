import React from "react";
import "./index.scss";
import { Form, Button } from "react-bootstrap";

function BlogCreate() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, content } = e.target;
    console.log(title.value, content.value);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="blog__form">
        <Form.Group controlId="formBasicEmail">
          <Form.Label className="blog_form-text">Title</Form.Label>
          <Form.Control name="title" type="text" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Content</Form.Label>
          <Form.Control name="content" as="textarea" rows={3} />
        </Form.Group>

        <Form.Group>
          <Form.File id="exampleFormControlFile1" label="Blog Thumbnail" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Blog
        </Button>
      </Form>
    </>
  );
}

export default BlogCreate;
