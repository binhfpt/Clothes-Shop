import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "pls provide username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "pls provide email"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "pls provide phonenumbeer"]
    },
    password: {
        type: String,
        required: [true, "pls provide password"],
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        default: false,
        type: Boolean
    },
    role: {
        type: String,
        default: "customer"
    },
    forgotPasswordLink: String,
    forgotPasswordLinkExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User
