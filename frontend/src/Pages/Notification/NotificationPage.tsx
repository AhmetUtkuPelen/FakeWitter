import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import PlaceHolderImg from "../../assets/avatar-placeholder.png"
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ? Notification Interface ? \\
interface Notification {
  _id: string;
  from: {
    _id: string;
    username: string;
    profileImg?: string;
  };
  type: "follow" | "like";
  read?: boolean;
}
// ? Notification Interface ? \\



const NotificationPage = () => {



	const queryClient = useQueryClient();



	const {data:notifications,isLoading} = useQuery({
		queryKey:["notifications"],
		queryFn : async () => {
			try {
				
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification/getNotifications`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include"
				});

				// Check if response is JSON before parsing
				const contentType = response.headers.get("content-type");
				if (!contentType || !contentType.includes("application/json")) {
					console.error("Non-JSON response received:", await response.text());
					throw new Error("Server returned non-JSON response");
				}

				const data = await response.json();

				if(!response.ok){
					throw new Error(data.error || "Something Went Wrong Getting Notifications !");
				}
				
				return data;

			} catch (error) {
				if(error instanceof Error){
					console.log(error.message);
				}
				return []; // Return empty array to prevent rendering errors
			}
		},
		retry: false,
	})
	


	const {mutate:deleteNotifications} = useMutation({
		mutationFn : async () => {
			try {
				
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification/deleteNotifications`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include"
				});

				// Check if response is JSON before parsing
				const contentType = response.headers.get("content-type");
				if (!contentType || !contentType.includes("application/json")) {
					console.error("Non-JSON response received:", await response.text());
					throw new Error("Server returned non-JSON response");
				}

				const data = await response.json();

				if(!response.ok){
					throw new Error(data.error || "Something Went Wrong Deleting Notifications !");
				}
				
				return data;

			} catch (error) {
				if(error instanceof Error){
					console.log(error.message);
				}
				return []; // Return empty array to prevent rendering errors
			}
		},
		onSuccess : () => {
			queryClient.invalidateQueries({queryKey : ["notifications"]});
			toast.success("Notifications Deleted Successfully !");
		},
		onError : (error:Error) => {
			toast.error(error?.message || "Something Went Wrong Deleting Notifications !");
		}
	})



	// ? Delete Notifications ? \\
	const DeleteNotifications = () => {
		deleteNotifications();
		toast.success("Notifications Deleted Successfully !");
		queryClient.invalidateQueries({queryKey : ["notifications"]});
	};
	// ? Delete Notifications ? \\



	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={DeleteNotifications}>Delete All Notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification: Notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || PlaceHolderImg} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;
