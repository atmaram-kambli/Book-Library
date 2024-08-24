const mongoose = require('mongoose');
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;
const bookInstanceSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    imprint: {
        type: String, required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
        required: true,
        default: "Maintenance",
    },
    due_back: {
        type: Date,
        default: Date.now,
    },
})

bookInstanceSchema.virtual("due_back_formatted").get(function () {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
  });
  

bookInstanceSchema.virtual('url').get(function() {
    return `/catalog/bookinstance/${this._id}`;
})

module.exports = mongoose.model('BookInstance', bookInstanceSchema);