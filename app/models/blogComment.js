// models/BlogComment.js
import mongoose, { Schema } from "mongoose";

const BlogCommentSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
        content: { type: String, required: true },
        // description
        status: {
            type: String,
            enum: ['pending', 'approved', 'spam', 'trash'],
            default: 'pending'
        },
    },
    { timestamps: true }
);


export default mongoose.models.BlogComment || mongoose.model("blogcomment", BlogCommentSchema);
