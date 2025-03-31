import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


interface User {
	_id: string;
	fullName: string;
	username: string;
	email: string;
	profileImg?: string;
	coverImg?: string;
	bio: string;
	link: string;
	createdAt: Date;
	following: string[];
	followers: string[];
}


const EditProfileModal = ({authUser} : {authUser : User | null}) => {




	// ? Form Data Interface ? \\
	interface FormData {
		fullName: string;
		username: string;
		email: string;
		bio: string;
		link: string;
		newPassword: string;
		currentPassword: string;
	}
	// ? Form Data Interface ? \\



	const [formData, setFormData] = useState<FormData>({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});



	// ? Query Client ? \\
	const queryClient = useQueryClient();
	// ? Query Client ? \\



	const {mutate:UpdateProfile,isPending:IsUpdatingProfile} = useMutation({
		mutationFn : async () => {
			try {
				
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/updateProfile}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
					credentials: "include"
				});

				const data = await response.json();

				if(!response.ok){
					throw new Error(data.error || "Something Went Wrong Updating Profile !");
				}
				
				return data;

			} catch (error) {
				if(error instanceof Error){
					toast.error(error.message);
				}
			}
		},
		onSuccess : () => {
			toast.success("Profile Updated Successfully !");
			Promise.all([
				queryClient.invalidateQueries({queryKey : ["authenticatedUser"]}),
				queryClient.invalidateQueries({queryKey : ["userProfile"]})
			])
		},
		onError : (error:Error) => {
			toast.error(error.message || "Something Went Wrong Updating Profile !");
		}
	})



	// ? Handle Input Change ? \\
	const HandleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	// ? Handle Input Change ? \\



	useEffect(() => {
		if(authUser){
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	},[authUser]);



	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => {
					const modal = document.getElementById("edit_profile_modal");
					if (modal instanceof HTMLDialogElement) modal.showModal();
				}}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							UpdateProfile();
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={HandleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={HandleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={HandleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={HandleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={HandleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={HandleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={HandleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{IsUpdatingProfile ? "UPDATING..." : "UPDATE"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;
