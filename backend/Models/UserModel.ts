import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    fullName: string;
    password: string;
    email: string;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    profileImg: string;
    coverImg: string;
    bio: string;
    link: string;
    likedPosts: mongoose.Types.ObjectId[];
}


const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		profileImg: {
			type: String,
			default: "",
		},
		coverImg: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			default: "",
            maxLength: 150,
		},

		link: {
			type: String,
			default: "",
		},
		likedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
