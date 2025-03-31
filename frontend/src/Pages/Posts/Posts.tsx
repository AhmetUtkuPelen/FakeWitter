import PostSkeleton from "../../Components/PostSkeleton/PostSkeleton";
import Post from "../../Components/Post/Post";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";


const Posts = ({contentType}:{contentType:string}) => {


	// ? Get Content Types ? \\
	const GetContentTypes = () => {
		switch (contentType) {
			case "forYou":
				return `${import.meta.env.VITE_BACKEND_URL}/api/posts/allPosts`;
			case "following":
				return `${import.meta.env.VITE_BACKEND_URL}/api/posts/followingPosts`;
			default:
				return `${import.meta.env.VITE_BACKEND_URL}/api/posts/allPosts}`;
		}
	}
	// ? Get Content Types ? \\



	// ? Get Content Types ? \\
	const PostType = GetContentTypes();
	// ? Get Content Types ? \\



	const {data:posts,isLoading,refetch,isRefetching} = useQuery({
		queryKey : ["posts"],
		queryFn : async () => {
			try {
				const response = await fetch(PostType);
				const data = await response.json();
				
				if(!response.ok){
					throw new Error(data?.error || "Something Went Wrong Getting Posts !");
				}

				return data;

			} catch (error) {
				if(error instanceof Error){
					console.log(error.message);
				}
			}
		}
	})



	// ? Post Interface ? \\
	interface Post {
		_id: string;
		text: string;
		img?: string;
		user: {
			username: string;
			profileImg?: string;
			fullName: string;
		};
		comments: {
			_id: string;
			text: string;
			user: {
				username: string;
				profileImg?: string;
				fullName: string;
			};
		}[];
		likes: string[];
	}
	// ? Post Interface ? \\



	useEffect(() => {
		refetch();
	},[contentType,refetch])



	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}

			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No Posts In This Tab Yet !</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post: Post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;
