const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema({
    channelId: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = {
    todoSchema
}