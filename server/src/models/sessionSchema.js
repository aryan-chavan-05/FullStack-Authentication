import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true,
    },
    refreshTokenHash: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    revoked: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const sessionModel = mongoose.model("session", sessionSchema);

export default sessionModel;