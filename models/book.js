const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({
    title: {
        type: String, required: true,
    },
    author: {
        type: Schema.Types.ObjectId, ref: "Author", required: true,
    },
    summary: {
        type: String, required: true,
    },
    isbn: {
        type: String, required: true,
    },
    genre: [{
        type: Schema.Types.ObjectId, ref:"Genre",
    }],
});


bookSchema.virtual("url").get(function () {
    return `/catalog/book/${this._id}`;
});

const bookModel = mongoose.model('Book', bookSchema);
module.exports = bookModel;