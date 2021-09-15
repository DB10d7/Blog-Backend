const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRoutes = express.Router();
const PORT = 4000;

let Blog = require('./Blog.Model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/blogs', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

blogRoutes.route('/').get(function(req, res) {
    Blog.find(function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.json(blogs);
        }
    });
});

blogRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Blog.findById(id, function(err, blog) {
        res.json(blog);
    });
});

blogRoutes.route('/delete/:id').delete(function(req, res) {
    let id = req.params.id;
    Blog.findById(id, function(err, blog) {
        if (!blog)
            res.status(404).send("data is not found");
        else
            blog.delete().then(blog => {
                res.json('Blog Deleted!');
            })
            .catch(err => {
                res.status(400).send("Delete not possible");
            });
    });
});


blogRoutes.route('/update/:id').put(function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (!blog)
            res.status(404).send("data is not found");
        else
            blog.author = req.body.author;
            blog.blogBody = req.body.blogBody;
            blog.title = req.body.title;

            blog.save().then(blog => {
                res.json('Blog updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

blogRoutes.route('/add').post(function(req, res) {
    let blog = new Blog(req.body);
    blog.save()
        .then(blog => {
            res.status(200).json({'Blog': 'Blog added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new Blog failed');
        });
});

app.use('/blogs', blogRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});