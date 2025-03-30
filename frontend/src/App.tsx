import { Route, Routes } from "react-router-dom"
import HomePage from "./Pages/HomePage/HomePage"
import RegisterPage from "./Pages/RegisterPage/RegisterPage"
import LoginPage from "./Pages/LoginPage/LoginPage"
import SideBar from "./Components/SideBar/SideBar"
import RightPanel from "./Components/RightPanel/RightPanel"
import NotificationPage from "./Pages/Notification/NotificationPage"
import ProfilePage from "./Pages/Profile/ProfilePage"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner"



function App() {


  // ? Get Authenticated User Query ? \\
  const {data,isLoading,error,isError} = useQuery({
    queryKey : ["authenticatedUser"],
    queryFn : async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getUser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        })

        const data = await response.json();

        console.log("Authenticated User : ",data);

        if(!response.ok){
          throw new Error(data.error || "Something Went Wrong Getting Authenticated User !");
        }
        
        return data;

      } catch (error) {
        if(error instanceof Error){
          toast.error(error.message);
        }
      }
    }
  })
  // ? Get Authenticated User Query ? \\


  if(isLoading){
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg"/>
      </div>
    )
  }


  return (
    <div className="flex max-w-6xl mx-auto">
      <SideBar/>
      <Routes>
        <Route path='/' element={<HomePage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/notifications' element={<NotificationPage />} />
				<Route path='/profile/:username' element={<ProfilePage />} />
      </Routes>
      <RightPanel/>
    </div>
  )
}

export default App