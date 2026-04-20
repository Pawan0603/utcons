import mongoose, { type Document, Schema } from 'mongoose';

export interface Article {
    id: string;
    title: string;
    content: string;
    createdBy: string;
    status: "draft" | "published";
    createdAt: Date;
}

const ArticleSchema = new Schema<Article>({
    title: {
        type: String,
        required: [true, "title is required"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "content is required"]
    },
    createdBy: { 
        type: String,
        required: [true, "createdBy is required"]
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        required: [true, "status is required"],
        default: "draft"
    }
}, { timestamps: true });

const ArticleModel = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default ArticleModel;