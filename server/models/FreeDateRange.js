const mongoose = require('mongoose');
const { Schema } = mongoose;

const freeDateRangeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
}, { timestamps: true });

const FreeDateRange = mongoose.model('FreeDateRange', freeDateRangeSchema);
module.exports = FreeDateRange;
