const mongoose = require("mongoose");

const { saveStatistic } = require("./../utils/statistic");

const Blog = require("../models/blog");
const User = require("./../models/user");

exports.getAll = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const items_per_page = parseInt(req.query.limit) || 100;

  if (page < 1) page = 1;

  Blog.find({})
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async (blogs) => {
      const request = {};
      const len = await Blog.find({}).countDocuments();

      request.currentPage = page;
      request.totalPages = Math.ceil(len / items_per_page);

      if (page > 1) {
        request.previous = {
          page: page - 1,
          limit: items_per_page,
        };
      }

      if (page * items_per_page < len) {
        request.next = {
          page: page + 1,
          limit: items_per_page,
        };
      }

      const response = {
        msg: "success",
        length: blogs.length,
        blogs: blogs.map((blog) => {
          return {
            ...blog["_doc"],
            request: {
              type: "GET",
              url: req.hostname + "/blogs/" + blog._id,
            },
          };
        }),
        request,
      };

      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        msg: "Server error!",
        error,
      });
    });
};

exports.getOne = (req, res, next) => {
  const { blogId } = req.params;

  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(202).json({
          msg: "ValidatorError",
          errors: {
            user: `Blog not found!`,
          },
        });
      }

      res.status(200).json({
        msg: "success",
        blog: {
          ...blog["_doc"],
          request: {
            type: "GET",
            url: req.hostname + "/blogs",
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        msg: "Server error!",
        error,
      });
    });
};

exports.create = async (req, res, next) => {
  const { title, content } = req.body;

  if (req.userData.roles != "admin") {
    return res.status(403).json({
      msg: "ValidatorError",
      errors: {
        user: `You don't have the permission!`,
      },
    });
  }
  try {
    const thumbnail = req.file
      ? req.hostname + "/" + req.file.path.replace(/\\/g, "/").replace("..", "")
      : "";

    const blog = new Blog({
      _id: mongoose.Types.ObjectId(),
      writer: req.userData._id,
      name: req.userData.name,
      title,
      content,
      thumbnail,
    });

    const history = {
      type: "create",
      collection: "blog",
      task: `Create a new blog: ${blog.title}`,
      date: new Date(),
      others: {
        id: blog._id,
      },
    };

    const [newBlog] = await Promise.all([
      blog.save(),
      saveStatistic(0, 0, 0, 0, 1, 0),
      User.updateOne(
        { _id: req.userData._id },
        {
          $push: {
            "history.manage": history,
          },
        }
      ),
    ]);

    res.status(201).json({
      msg: "success",
      blog: {
        ...newBlog["_doc"],
        request: {
          type: "GET",
          url: req.hostname + "/blogs/" + blog._id,
        },
      },
    });
  } catch (error) {
    console.log(error);
    let respond = {};
    error.errors &&
      Object.keys(error.errors).forEach(
        (err) => (respond[err] = error.errors[err].message)
      );

    res.status(202).json({
      msg: "ValidatorError",
      errors: respond,
    });
  }
};

exports.update = async (req, res, next) => {
  const { blogId: _id } = req.params;

  if (req.userData.roles != "admin") {
    return res.status(403).json({
      msg: "ValidatorError",
      errors: {
        user: `You don't have the permission!`,
      },
    });
  }

  try {
    const blog = await Blog.findById(_id);
    const oldBlog = blog.title;

    for (const ops of req.body) {
      blog[ops.propName] = ops.value;
    }

    const history = {
      type: "update",
      collection: "blog",
      task: `Update a blog: ${oldBlog}`,
      date: new Date(),
      others: {
        id: blog._id,
        fields: req.body.map((ele) => `${ele.propName}: ${ele.value}`),
      },
    };

    const [newBlog] = await Promise.all([
      blog.save(),
      User.updateOne(
        { _id: req.userData._id },
        {
          $push: {
            "history.manage": history,
          },
        }
      ),
    ]);

    res.status(200).json({
      msg: "success",
      blog: newBlog,
      request: {
        type: "GET",
        url: req.hostname + "/blogs/" + _id,
      },
    });
  } catch (error) {
    console.log(error);
    let respond = {};
    error.errors &&
      Object.keys(error.errors).forEach(
        (err) => (respond[err] = error.errors[err].message)
      );

    res.status(202).json({
      msg: "ValidatorError",
      errors: respond,
    });
  }
};

exports.delete = async (req, res, next) => {
  const { blogId: _id } = req.params;

  if (req.userData.roles != "admin") {
    return res.status(403).json({
      msg: "ValidatorError",
      errors: {
        user: `You don't have the permission!`,
      },
    });
  }

  try {
    const blog = await Blog.findById(_id);

    const history = {
      type: "delete",
      collection: "blog",
      task: `Delete a blog: ${blog.title}`,
      date: new Date(),
      others: {
        id: blog._id,
      },
    };

    await Promise.all([
      Blog.deleteOne({ _id }),
      User.updateOne(
        { _id: req.userData._id },
        {
          $push: {
            "history.manage": history,
          },
        }
      ),
    ]);

    res.status(200).json({
      msg: "success",
      request: {
        type: "POST",
        url: req.hostname + "/blogs",
        body: {
          writer: "ObjectId",
          title: "String",
          content: "String",
          thumbnail: "File: .jpeg, .jpg, .png",
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server error!",
      error,
    });
  }
};
