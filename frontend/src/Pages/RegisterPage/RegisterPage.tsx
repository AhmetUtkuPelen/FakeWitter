import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import XSvg from "../../Components/svgs/X";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";



const RegisterPage = () => {

	const navigate = useNavigate();

	// ? Form Data Interface ? \\
    interface FormData {
		email: string;
		username: string;
		fullName: string;
		password: string;
	}
	// ? Form Data Interface ? \\



	// ? Form Data State ? \\
    const [formData, setFormData] = useState<FormData>({
        email: "",
        username: "",
        fullName: "",
        password: ""
    });
	// ? Form Data State ? \\



	// ? Register Mutation ? \\
	const {mutate,isError,isPending,error} =useMutation({
		mutationFn : async (formData:FormData) => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				const data = await response.json();

				if(!response.ok){
					throw new Error(data.error || "Something went wrong Creating User !");
				}
				
				return data;
			
			} catch (error) {
				if(error instanceof Error){
					toast.error(error.message);
				}
			}
		},
		onSuccess : () => {
			toast.success("Registered Successfully !");
			navigate("/login");
		},
		onError : () => {
			toast.error("Something went wrong !");
		}
	});
	// ? Register Mutation ? \\




	// ? Handle Submit ? \\
	const HandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(formData)
	};
	// ? Handle Submit ? \\



	// ? Handle Input Change ? \\
	const HandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	// ? Handle Input Change ? \\



	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={HandleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white text-center'>Join Today !</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={HandleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={HandleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={HandleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={HandleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "REGISTERING..." : "REGISTER"}
					</button>
					{isError && <p className='text-red-500'>{error?.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg text-center'>Already Have An Account ?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>LOGIN</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default RegisterPage;
