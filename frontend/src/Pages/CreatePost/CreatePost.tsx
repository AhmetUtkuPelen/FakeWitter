import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import PlaceHolderImg from "../../assets/avatar-placeholder.png"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import EmojiPicker from 'emoji-picker-react';

const CreatePost = () => {

	// ? Add state for emoji picker visibility ?
	const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
	
	// ? Add function to handle emoji selection ? \\
	const handleEmojiClick = (emojiData: any) => {
		setText(prevText => prevText + emojiData.emoji);
		setShowEmojiPicker(false);
	};

	// ? User Interface To Create Post ? \\
	interface CreatePostUser {
		_id: string;
		username: string;
		fullName: string;
		profileImg?: string;
	}
	// ? User Interface To Create Post ? \\



	// ? State To Create Post ? \\
	const [text, setText] = useState<string>("");
	const [img, setImg] = useState<string | null>(null);
	// ? State To Create Post ? \\


	const imgRef = useRef<HTMLInputElement>(null);



	// ? Get Authenticated User ? \\
	const {data:authUser} = useQuery<CreatePostUser | null>({
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
	// ? Get Authenticated User ? \\



	const queryClient = useQueryClient();


	
	// ? Create Post Mutation ? \\
	const {mutate:CreatePost, isPending, isError, error} = useMutation({
		mutationFn : async (postData: {text: string, img: string | null}) => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/createPost`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(postData),
					credentials: "include"
				});

				const data = await response.json();

				if(!response.ok){
					throw new Error(data.error || "Something Went Wrong Creating Post !");
				}
				
				return data;
			
			} catch (error) {
				if(error instanceof Error){
					console.log(error.message);
					throw error;
				}
			}
		},
		onSuccess : () => {
			setText("");
			setImg(null);
			queryClient.invalidateQueries({queryKey : ["posts"]});
			toast.success("Post Created Successfully !");
		}
	})
	// ? Create Post Mutation ? \\




	// ? Handle Submit ? \\
	const HandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		// Validate that either text or image is provided
		if (!text && !img) {
			toast.error("Please provide text or an image for your post!");
			return;
		}
		
		const postData = {
			text: text,
			img: img
		};
		
		CreatePost(postData);
	};
	// ? Handle Submit ? \\



	// ? Handle Image Change ? \\
	const HandleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	// ? Handle Image Change ? \\



	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser?.profileImg || PlaceHolderImg} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={HandleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								if (imgRef.current) {
									imgRef.current.value = "";
								}
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current?.click()}
						/>
						<div className="relative">
							<BsEmojiSmileFill 
								className='fill-primary w-5 h-5 cursor-pointer' 
								onClick={() => setShowEmojiPicker(!showEmojiPicker)}
							/>
							{showEmojiPicker && (
								<div className="absolute bottom-10 left-0 z-10">
									<EmojiPicker onEmojiClick={handleEmojiClick} />
								</div>
							)}
						</div>
					</div>
					<input type='file' hidden ref={imgRef} onChange={HandleImgChange} accept="image/*" />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "POSTING..." : "POST"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{error?.message}</div>}
			</form>
		</div>
	);
};
export default CreatePost;
