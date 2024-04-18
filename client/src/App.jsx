import './App.css'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Flights from './pages/Flights';
import Landing from './pages/Landing';
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { UserContextProvider } from '../context/userContext'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials =  true

function App() {
  return (
    <UserContextProvider>
    <Navbar />
    <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
    <Routes>
      <Route path= '/' element={<Home />} />
      <Route path= '/register' element={<Register />} />
      <Route path= '/login' element={<Login />} />
      <Route path='/flights' element={<Flights />} />
      <Route path='/landing' element={<Landing />} />
    </Routes>
    </UserContextProvider>
  )
}

export default App
