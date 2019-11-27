var mongoose = require('mongoose');

var Player = mongoose.model('Player', {
    name: {
        type: String,
        required: true
    },
    ccNumber: {
        type: Number,
        required: true
    },
    expirationDate:{
        type: Date,
        required: true
    },
    cvcNumber: {
        type: Number,
        required: true
    },
});

module.exports = {
    Player: Player
}

