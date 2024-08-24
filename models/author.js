const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        // required: true,
        maxLength: 100,
    },
    lastName: {
        type: String,
        // required: true,
        maxLength: 100,
    },
    dataOfBirth: Date,
    dateOfDeath: Date
});


authorSchema.virtual("fullName").get(function() {
    let name="";
    if(this.firstName && this.lastName) {
        name = `${this.firstName} ${this.lastName}`;
    }
    return name;
});

authorSchema.virtual("url").get(function () {
    return `/catalog/author/${this._id}`;
  });


module.exports = mongoose.model('Author', authorSchema);