import mongoose, { Document } from "mongoose";

export interface IPost extends Document {
	_id: mongoose.Types.ObjectId;
	user: mongoose.Types.ObjectId;
	text: string | null;
	img: string | null;
	likes: mongoose.Types.ObjectId[];
	comments: {
		text: string;
		user: mongoose.Types.ObjectId;
	}[];
}


const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
		},
		img: {
			type: String,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				text: {
					type: String,
					required: true,
				},
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;