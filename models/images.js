const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({

    url: {
        type: String,
        required: true
    }, publicId: {
        type: String,
        required: true
    }, createdAt: {
        type: Date,
        default: Date.now
    }, uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }

}, {
    timestamps: true
})


module.exports = mongoose.model("images", ImageSchema);
