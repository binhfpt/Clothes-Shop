// models/Blog.js
import mongoose, { Schema } from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
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


export default mongoose.models.blog || mongoose.model("blog", BlogSchema);
