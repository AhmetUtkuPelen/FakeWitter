import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import PlaceHolderImg from "../../assets/avatar-placeholder.png"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const CreatePost = () => {


	// ? User Interface To Create Post ? \\
	interface CreatePostUser {
		_id: string;
		username: string;
		fullName: string;
		profileImg?: string;
	}
	// ? User Interface To Create Post ? \\



	const [text, setText] = useState<string>("");
	const [img, setImg] = useState<string | null>(null);

	const imgRef = useRef<HTMLInputElement>(null);

	const {data:authUser} = useQuery<CreatePostUser | null>({queryKey : ["authenticatedUser"]});

	const queryClient = useQueryClient();

	const {mutate:CreatePost, isPending, isError, error} = useMutation({
		mutationFn : async (formData:FormData) => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/createPost}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
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



	// ? Handle Submit ? \\
	const HandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('text', text);
		if (img) formData.append('img', img);
		CreatePost(formData);
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
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
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
