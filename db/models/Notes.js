const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: String,
    pinned: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    userId:String,
    tags:Array,
    createdAt: { type: Date, default: Date.now }
});

const Notes = mongoose.model('notes',notesSchema);

module.exports = Notes;