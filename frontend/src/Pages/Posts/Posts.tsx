import { POSTS } from "../../Utility/DataBase/DummyDataBase";
import PostSkeleton from "../../Components/PostSkeleton/PostSkeleton";
import Post from "../../Components/Post/Post";


const Posts = () => {


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


	
	const isLoading : boolean = false;



	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No Posts In This Tab. Switch 👻</p>}
			{!isLoading && POSTS && (
				<div>
					{POSTS.map((post: Post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;