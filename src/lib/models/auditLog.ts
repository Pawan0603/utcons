import mongoose, { type Document, Schema } from 'mongoose';

export interface AuditLog {
    userId: string;
    action: string;
    articleId: string;
    timestamp: Date;
}

const AuditLogSchema = new Schema<AuditLog>({
    userId: {
        type: String,
        required: [true, "userId is required"]
    },
    action: {
        type: String,
        required: [true, "action is required"]
    },
    articleId: {
        type: String,
        required: [true, "articleId is required"]
    },
    timestamp: {
        type: Date,
        required: [true, "timestamp is required"]
    }
}, { timestamps: true });

const AuditLogModel = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

export default AuditLogModel;