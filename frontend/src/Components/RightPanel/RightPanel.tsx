import { Link } from "react-router";
import RightPanelSkeleton from "../Skeletons/RightPanelSkeleton";
import PlaceHolderImg from "../../assets/avatar-placeholder.png";
import { useQuery } from "@tanstack/react-query";
import FollowHook from "../../Hooks/FollowHook";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";


const RightPanel = () => {


	// ? Get Suggested Users Query ? \\
	const {data:GetSuggestedUsers,isLoading} = useQuery({
		queryKey:["suggestedUsers"],
		queryFn : async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/suggestedUsers`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include"
				});

				const data = await response.json();

				if(!response.ok){
					throw new Error(data.error || "Something Went Wrong Getting Suggested Users !");
				}
				
				return data;
			
			} catch (error) {
				if(error instanceof Error){
					console.log(error.message);
				}
			}
		},
		retry: false,
	})
	// ? Get Suggested Users Query ? \\



	// ? Users For Right Panel Interface ? \\
	interface UserForRightPanel {
		_id: string;
		fullName: string;
		username: string;
		profileImg?: string;
	}
	// ? Users For Right Panel Interface ? \\



	// ? Follow Hook That Comes From FollowHook.tsx ? \\
	const {followUser,isPending} = FollowHook();
	// ? Follow Hook That Comes From FollowHook.tsx ? \\



	// ? If There Are No Suggested Users, Don't Render The Right Panel ? \\
	if(GetSuggestedUsers?.length === 0){
		return (
			<div className="md:w-64 w-0"></div>
		);
	}
	// ? If There Are No Suggested Users, Don't Render The Right Panel ? \\




	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* ? item ? */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						GetSuggestedUsers?.map((user:UserForRightPanel) => (
							<Link
								to={`/profile/${user?.username}`}
								className='flex items-center justify-between gap-4'
								key={user?._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user?.profileImg || PlaceHolderImg} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user?.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user?.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e: React.MouseEvent) => {e.preventDefault();followUser(user._id);}}
									>
										{isPending ? <LoadingSpinner size="md"/> : "FOLLOW"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
