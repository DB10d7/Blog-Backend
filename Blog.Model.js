const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Blog = new Schema({
    author: {
        type: String
    },
    blogBody: {
        type: String
    },
    title: {
        type: String
    }
});

module.exports = mongoose.model('Blog', Blog);