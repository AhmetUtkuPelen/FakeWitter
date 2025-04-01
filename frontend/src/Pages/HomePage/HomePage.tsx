import { useState } from "react";
import Posts from "../Posts/Posts";
import CreatePost from "../CreatePost/CreatePost";



const HomePage = () => {



	// ? State To Get Content Type ? \\
	const [contentType, setContentType] = useState("forYou");
	// ? State To Get Content Type ? \\


	
	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setContentType("forYou")}
					>
						For you
						{contentType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setContentType("following")}
					>
						Following
						{contentType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/* ?  CREATE POST INPUT ? */}
				<CreatePost />

				{/* ? POSTS ? */}
				<Posts contentType={contentType} />
			</div>
		</>
	);
};
export default HomePage;
