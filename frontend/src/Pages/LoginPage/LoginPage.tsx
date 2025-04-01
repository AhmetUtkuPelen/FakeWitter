import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import XSvg from "../../Components/svgs/X";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";



const LoginPage = () => {


	const navigate = useNavigate();


	// ? Form Data Interface ? \\
  interface FormData {
    username: string;
    password: string;
  }
	// ? Form Data Interface ? \\



  	// ? Form Data State ? \\
	const [formData, setFormData] = useState<FormData>({
		username: "",
		password: "",
	});
  	// ? Form Data State ? \\




	// ? Query Client ? \\
	const queryClient = useQueryClient();
	// ? Query Client ? \\



	// ? Login Mutation ? \\
	const {mutate,isPending,isError,error} = useMutation({
		mutationFn : async (formData:FormData) => {
			try {
				
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
					credentials: "include"
				});

				const data = await response.json();

				if(!response.ok){
					throw new Error(data.error || "Something Went Wrong Logging In !");
				}
				
				return data;
			
			} catch (error) {
				if(error instanceof Error){
					toast.error(error.message);
					console.error("Login error:", error);
				}
				return null;
			}
		},

		onSuccess : (data) => {
			if (!data) {
				toast.error("Login failed - no data returned");
				return;
			}
			// ? Invalidate Authenticated User Query That Comes From App.tsx ? \\
			queryClient.invalidateQueries({queryKey : ["authenticatedUser"]});
			toast.success("Logged In Successfully !");
			navigate("/");
		},
		onError : () => {
			toast.error("Something Went Wrong Logging In !");
		}

	})
	// ? Login Mutation ? \\


	
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
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={HandleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={HandleInputChange}
							value={formData.username}
						/>
					</label>

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
						{isPending ? "LOGGING IN..." : "LOGIN"}
					</button>
					{isError && <p className='text-red-500'>
						{error instanceof Error ? error.message : "Something went wrong"}
						</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/register'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>REGISTER</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
