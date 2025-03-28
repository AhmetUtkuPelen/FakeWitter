import mongoose, { Document } from "mongoose";

export interface INotification extends Document {
	from: mongoose.Types.ObjectId;
	to: mongoose.Types.ObjectId;
	type: "follow" | "like";
	read: boolean;
}

const notificationSchema = new mongoose.Schema(
	{
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["follow", "like"],
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
