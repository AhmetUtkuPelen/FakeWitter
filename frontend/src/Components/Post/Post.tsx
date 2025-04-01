import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import PlaceHolderImg from "../../assets/avatar-placeholder.png"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { FormatPostDate } from "../../Utility/GetDateUtility/GetDateUtility";



	// ? Post Interface ? \\
interface PostProps {
	post: {
		user: {
			_id: string;
			username: string;
			fullName: string;
			profileImg?: string;
		};
		text: string;
		img?: string;
		_id: string;
		comments: {
			_id: string;
			text: string;
			user: {
				username: string;
				fullName: string;
				profileImg?: string;
			};
		}[];
		likes: any[];
		createdAt: Date;
	};
}
	// ? Post Interface ? \\


	// ? User Interface ? \\
	interface User {
		_id?: string;
		username: string;
		fullName: string;
		profileImg?: string;
	}
	// ? User Interface ? \\



	// ? Comment Interface ? \\
	interface Comment {
		_id: string;
		text: string;
		user: User;
	}
	// ? Comment Interface ? \\



const Post = ({post} : PostProps) => {
	

	const [comment, setComment] = useState<string>("");

	const {data:authUser} = useQuery<User | null>({
		queryKey: ["authenticatedUser"],
		queryFn: async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getUser`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include"
				});
				
				// If we get a 401, it means user is not logged in - this is expected
				if (response.status === 401) {
					return null;
				}
				
				const data = await response.json();
				
				if(!response.ok){
					throw new Error(data.error || "Something went wrong getting user data");
				}
				
				return data;
			} catch (error) {
				console.error("Error fetching user:", error);
				return null;
			}
		}
	});

	const postOwner : User = post.user;
	const isLiked : boolean = post.likes.includes(authUser?._id);



	// ? Check If Post Is Owned By Authenticated User ? \\
	const isMyPost : boolean = authUser?._id === post.user._id;
	// ? Check If Post Is Owned By Authenticated User ? \\


	const formattedDate: string = FormatPostDate(post.createdAt);


	// ? Delete Post Query CLient ? \\
	const queryDeleteClient = useQueryClient();
	// ? Delete Post Query CLient ? \\



	// ? Delete Post Query ? \\
	const {mutate:deletePost,isPending:isDeletingPost} = useMutation({
		mutationFn : async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/deletePost/${post._id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include"
				});

				// Check if response is OK before trying to parse JSON
				if (!response.ok) {
					const errorText = await response.text();
					console.error("Error response:", errorText);
					throw new Error(errorText || "Something Went Wrong Deleting Post!");
				}
				
				const data = await response.json();
				return data;
			
			} catch (error) {
				if(error instanceof Error){
					console.log(error.message);
					throw error; // Re-throw to trigger onError
				}
			}
		},
		onSuccess: () => {
			toast.success("Post Deleted Successfully !");
			queryDeleteClient.setQueryData(["posts"], (oldData: any) => {
				return oldData.filter((p: PostProps['post']) => p._id !== post._id);
			})
		},
		onError: (error) => {
			toast.error("Failed to delete post");
			console.error(error);
		}
	})
	// ? Delete Post Query ? \\

	

	// ? Like Post Query ? \\
	const {mutate:LikePost,isPending:isPendingLikePost} = useMutation({
		mutationFn : async () => {
			try {
				
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/like/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include"
				});

				// Check if response is OK before trying to parse JSON
				if (!response.ok) {
					const errorText = await response.text();
					console.error("Error response:", errorText);
					throw new Error(errorText || "Something Went Wrong Liking Post!");
				}
				
				const data = await response.json();
				return data;

			} catch (error) {
				if(error instanceof Error){
					console.log(error.message);
					throw error;
				}
			}
		},
		onSuccess : () => {
			queryDeleteClient.invalidateQueries({queryKey : ["posts"]});
			toast.success("Post Liked Successfully !");
		},
		onError : () => {
			toast.error("Something Went Wrong Liking Post !");
		}
	})
	// ? Like Post Query ? \\



	// ? Comment Post Query ? \\
	const {mutate:CommentOnPost,isPending:isCommenting} = useMutation({
		mutationFn : async () => {
			try {
				
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/commentOnPost/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({text : comment}),
					credentials: "include"
				});

				// Check if response is OK before trying to parse JSON
				if (!response.ok) {
					const errorText = await response.text();
					console.error("Error response:", errorText);
					throw new Error(errorText || "Something Went Wrong Commenting!");
				}
				
				const data = await response.json();
				return data;

			} catch (error) {
				if(error instanceof Error){
					console.log(error.message);
					throw error;
				}
			}
		},
		onSuccess : () => {
			toast.success("Commented Successfully !");
			setComment("");
			queryDeleteClient.invalidateQueries({queryKey : ["posts"]});
		},
		onError : () => {
			toast.error("Something Went Wrong Commenting !");
		}
	});
	// ? Comment Post Query ? \\
	

	// ? Handle Delete Post ?\\
	const HandleDeletePost = () => {
		deletePost();
	};
	// ? Handle Delete Post\\



	// ? Handle Post Comment ?\\
	const HandlePostComment = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		// Validate comment before submitting
		if (!comment.trim()) {
			toast.error("You need to write something in your comment!");
			return;
		}
		
		if(isCommenting) return;
		CommentOnPost();
	};
	// ? Handle Post Comment\\



	// ? Handle Like Post ?\\
	const HandleLikePost = () => {
		if(isPendingLikePost) return;
		LikePost();
	};
	// ? Handle Like Post ?\\


	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || PlaceHolderImg} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullName}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeletingPost && <FaTrash className='cursor-pointer hover:text-red-500' onClick={HandleDeletePost} />}
								{isDeletingPost && (<LoadingSpinner size='md' />)}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => {
									const modal = document.getElementById("comments_modal" + post._id);
									if (modal instanceof HTMLDialogElement) modal.showModal();
								}}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>

							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No Comments Yet 🤔 Be The First One 😉
											</p>
										)}
										{post.comments.map((comment : Comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={HandlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add A Comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<LoadingSpinner size='md' />
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>Close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={HandleLikePost}>
								{isPendingLikePost && <LoadingSpinner size='md' />}
								{!isLiked && !isPendingLikePost && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isPendingLikePost && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;
