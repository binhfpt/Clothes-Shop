// models/Blog.js
import mongoose, { Schema } from "mongoose";
import "./user";
const BlogSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: { type: String, required: true, trim: true, unique: true },
        subTitle: { type: String, trim: true },
        content: { type: String, required: true },
        thumbnail: { type: String, required: false },
        tag: { type: String, required: true },
        // description
        slug: { type: String, required: true, unique: true, lowercase: true },
        status: {
            type: String,
            enum: ['draft', 'published', 'scheduled', 'archived'],
            default: 'draft'
        },
        publishDate: {
            type: Date,
            default: null
        },
        seo: {
            metaTitle: { type: String, maxlength: 60 },
            metaDescription: { type: String, maxlength: 160 }
        },
        readingTime: {
            type: Number, // in minutes
            default: 1
        },
        viewers: [{
            sessionKey: String,
            viewedAt: { type: Date, default: Date.now }
        }]


    },
    { timestamps: true }
);


const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export default Blog;
