var mongoose = require('mongoose');

var Whatever = mongoose.model('Whatever', {
    name: {
        type: String,
        required: true
    },
    wins: {
        type: Number,
        required: true
    }
});

module.exports = {
    Whatever: Whatever
}

