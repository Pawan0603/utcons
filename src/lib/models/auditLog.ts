import mongoose, { Schema } from 'mongoose';

export interface AuditLog {
  userId: mongoose.Schema.Types.ObjectId;
  action: string;
  articleId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const AuditLogSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    action: {
      type: String,
      enum: ["CREATE_ARTICLE", "DELETE_ARTICLE", "PUBLISH_ARTICLE"], // ✅ better
      required: [true, "action is required"],
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: [true, "articleId is required"],
    },
  },
  { timestamps: true }
);

const AuditLogModel =
  mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);

export default AuditLogModel;