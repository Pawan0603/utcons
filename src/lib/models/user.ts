import mongoose, { type Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: "admin" | "editor" | "viewer"
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "plese use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "password must be required"]
    },
    role: {
        type: String,
        enum: ["admin", "editor", "viewer"],
        required: [true, "role must be required"],
        default: "viewer"
    },
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)

export default UserModel;