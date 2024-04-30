import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Register from './pages/Register';
import Login from './pages/Login';
import Flights from './pages/Flights';
import PrivateRoutes from './components/PrivateRoutes';

import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register'

  return (
    <UserContextProvider>
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      {!isHomePage && !isLogin && !isRegister && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/flights" element={<Flights />} />
        </Route>
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;