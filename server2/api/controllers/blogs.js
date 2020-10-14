const Blog = require('../models/blog')

exports.getAll = (req, res, next) => {

    Blog.find({})
    .select('_id date writer title content thumbnail')
    .then(blogs => {
        const response = {
            msg: 'success',
            length: blogs.length,
            blogs: blogs.map(blog => {
                return {
                    _id: blog._id,
                    date: blog.date,
                    writer: blog.writer,
                    title: blog.title,
                    content: blog.content,
                    thumbnail: blog.thumbnail,
                    request: {
                        type: 'GET',
                        url: req.hostname + '/blogs/' + blog._id
                    }
                }
            })
        }

        res.status(200).json(response)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.getOne = (req, res, next) => {
    const {blogId} = req.params

    Blog.findById(blogId)
    .select('_id date writer title content thumbnail')
    .then(blog => {

        if(!blog){
            return res.status(404).json({
                msg: 'Blog not found!'
            })
        }

        res.status(200).json({
            msg: 'success',
            blog: {
                _id: blog._id,
                date: blog.date,
                writer: blog.writer,
                title: blog.title,
                content: blog.content,
                thumbnail: blog.thumbnail,
                request: {
                    type: 'GET',
                    url: req.hostname + '/blogs'
                }
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
}

exports.create = (req, res, next) => {
    const {writer, title, content} = req.body

    if(!writer || !title || !content){
        return res.status(400).json({
            msg: 'Writer, title, content are required!'
        })
    }

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const blog = new Blog({
        writer,
        title,
        content,
        thumbnail: req.hostname + '/' + req.file.path.replace(/\\/g,'/').replace('..', '')
    })

    blog.save()
    .then(blog => {
        res.status(201).json({
            msg: "success",
            blog: {
                _id: blog._id,
                date: blog.date,
                writer: blog.writer,
                title: blog.title,
                content: blog.content,
                thumbnail: blog.thumbnail,
                request: {
                    type: 'GET',
                    url: req.hostname + '/blogs/' + blog._id
                }
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.update = (req, res, next) => {
    const {blogId: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const blog = {}

    for (const ops of req.body) {
        blog[ops.propName] = ops.value
    }

    Blog.updateOne({_id}, {$set: blog})
    .then(result => {
        res.status(200).json({
            msg: "success",
            request: {
                type: 'GET',
                url: req.hostname + '/blogs/' + _id
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.delete = (req, res, next) => {
    const {blogId: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    Blog.deleteOne({_id})
    .then(result => {
        res.status(200).json({
            msg: 'success',
            request: {
                type: 'POST',
                url: req.hostname + '/blogs',
                body: {
                    writer: 'ObjectId',
                    title: 'String',
                    content: 'String',
                    thumbnail: 'File: .jpeg, .jpg, .png'
                }
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}