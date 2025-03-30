import { Route, Routes } from "react-router-dom"
import HomePage from "./Pages/HomePage/HomePage"
import RegisterPage from "./Pages/RegisterPage/RegisterPage"
import LoginPage from "./Pages/LoginPage/LoginPage"
import SideBar from "./Components/SideBar/SideBar"
import RightPanel from "./Components/RightPanel/RightPanel"
import NotificationPage from "./Pages/Notification/NotificationPage"
import ProfilePage from "./Pages/Profile/ProfilePage"



function App() {


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