import mongoose from "mongoose";
export default {
    name: {
        type: String,
        required: true
    },
    creator_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    update_date: {
        type: Date,
        default: Date.now
    }
};
