import { Route, Routes } from "react-router-dom"
import HomePage from "./Pages/HomePage/HomePage"
import RegisterPage from "./Pages/RegisterPage/RegisterPage"
import LoginPage from "./Pages/LoginPage/LoginPage"



function App() {


  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        <Route path='/' element={<HomePage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/login' element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App