const {saveHistory} = require('./../utils/history')
const {saveStatistic} = require('./../utils/statistic')

const Blog = require('../models/blog')

exports.getAll = (req, res, next) => {

    const page = parseInt(req.query.page) || 1
    const items_per_page = parseInt(req.query.limit) || 100

    if (page < 1) page = 1

    Blog.find({})
    .select('_id date writer name title content thumbnail')
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async blogs => {
        const request = {}
        const len = await Blog.find({}).count()

        request.currentPage = page
        request.totalPages = Math.ceil(len / items_per_page)

        if (page > 1) {
            request.previous = {
                page: page - 1,
                limit: items_per_page
            }
        }

        if (page * items_per_page < len) {
            request.next = {
                page: page + 1,
                limit: items_per_page
            }
        }

        const response = {
            msg: 'success',
            length: blogs.length,
            blogs: blogs.map(blog => {
                return {
                    _id: blog._id,
                    date: blog.date,
                    writer: blog.writer,
                    name: blog.name,
                    title: blog.title,
                    content: blog.content,
                    thumbnail: blog.thumbnail,
                    request: {
                        type: 'GET',
                        url: req.hostname + '/blogs/' + blog._id
                    }
                }
            }),
            request
        }

        res.set("x-total-count", blogs.length);
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
    .select('_id date writer name title content thumbnail')
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
                name: blog.name,
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
    const {title, content} = req.body

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const thumbnail = req.file ? req.hostname + '/' + req.file.path.replace(/\\/g,'/').replace('..', '') : ''

    const blog = new Blog({
        writer: req.userData._id,
        name: req.userData.name,
        title,
        content,
        thumbnail
    })

    blog.save()
    .then(async blog => {

        await saveHistory(req.userData._id, 'blogs', 'manage', `Create a blog: ${blog._id}-${title} | ${new Date()}`)
        await saveStatistic(0, 0, 0, 0, 1, 0)

        res.status(201).json({
            msg: "success",
            blog: {
                _id: blog._id,
                date: blog.date,
                writer: req.userData._id,
                name: req.userData.name,
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
        let respond = {}
        error.errors && Object.keys(error.errors).forEach(err => respond[err] = error.errors[err].message)

        res.status(422).json({
            msg: 'ValidatorError',
            errors: respond
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

    Blog.updateOne({_id}, {$set: blog}, {runValidators: true})
    .then(async result => {

        await saveHistory(req.userData._id, 'blogs', 'manage', `Update a blog: ${_id}-${Object.keys(blog).join('-')} | ${new Date()}`)

        res.status(200).json({
            msg: "success",
            request: {
                type: 'GET',
                url: req.hostname + '/blogs/' + _id
            }
        })
    })
    .catch(error => {
        let respond = {}
        error.errors && Object.keys(error.errors).forEach(err => respond[err] = error.errors[err].message)

        res.status(422).json({
            msg: 'ValidatorError',
            errors: respond
        })
    })
}

exports.delete = async (req, res, next) => {
    const {blogId: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const blog = await Blog.findById(_id)

    Blog.deleteOne({_id})
    .then(async result => {

        await saveHistory(req.userData._id, 'blogs', 'manage', `Delete a blog: ${blog._id}-${blog.title} | ${new Date()}`)

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
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}