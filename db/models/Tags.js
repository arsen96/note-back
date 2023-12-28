const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
    name: String,
    userId:String
});

const Tags = mongoose.model('tags',tagsSchema);

module.exports = Tags;