import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./Pages/HomePage/HomePage"
import RegisterPage from "./Pages/RegisterPage/RegisterPage"
import LoginPage from "./Pages/LoginPage/LoginPage"
import SideBar from "./Components/SideBar/SideBar"
import RightPanel from "./Components/RightPanel/RightPanel"
import NotificationPage from "./Pages/Notification/NotificationPage"
import ProfilePage from "./Pages/Profile/ProfilePage"
import { useQuery } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner"



function App() {


  // ? Get Authenticated User Query ? \\
  const {data:authenticatedUser,isLoading} = useQuery({
    queryKey : ["authenticatedUser"],
    queryFn : async () => {
      try {
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getUser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });

        // ? If we get a 401, it means user is not logged in - this is expected ? \\
        if (response.status === 401) {
          return null;
        }

        const data = await response.json();

        if(!response.ok){
          throw new Error(data.error || "Something Went Wrong Getting Authenticated User !");
        }
        
        return data;

      } catch (error) {
        if(error instanceof Error){
          console.error("Auth error:", error);
        }
        return null;
      }
    },
    retry: false,
  })
  // ? Get Authenticated User Query ? \\


  // ? Loading ? \\
  if(isLoading){
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg"/>
      </div>
    )
  }
  // ? Loading ? \\




  return (
    <div className="flex max-w-6xl mx-auto">
      {/* ? Show SideBar If User Is Authenticated ? */}
      {authenticatedUser && <SideBar/>}
      <Routes>
        <Route path='/' element={authenticatedUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/register' element={!authenticatedUser ? <RegisterPage /> : <Navigate to='/' />} />
				<Route path='/login' element={!authenticatedUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authenticatedUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authenticatedUser ? <ProfilePage /> : <Navigate to='/login' />} />
        {/* ? Show RightPanel If User Is Authenticated ? */}
      </Routes>
      {authenticatedUser && <RightPanel/>}
      <Toaster/>
    </div>
  )
}

export default App

