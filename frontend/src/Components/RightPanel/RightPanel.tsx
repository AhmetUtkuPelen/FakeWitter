import { Link } from "react-router";
import { USERS_FOR_RIGHT_PANEL } from "../../Utility/DataBase/DummyDataBase";
import RightPanelSkeleton from "../Skeletons/RightPanelSkeleton";
import PlaceHolderImg from "../../assets/avatar-placeholder.png";


const RightPanel = () => {


	// ? Users For Right Panel Interface ? \\
	interface UserForRightPanel {
		_id: string;
		fullName: string;
		username: string;
		profileImg?: string;
	}


    const isLoading : boolean = false;

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						USERS_FOR_RIGHT_PANEL?.map((user:UserForRightPanel) => (
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
										onClick={(e: React.MouseEvent) => e.preventDefault()}
									>
										Follow
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
