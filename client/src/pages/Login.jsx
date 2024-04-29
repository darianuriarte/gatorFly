import { useState } from "react"
import axios from 'axios'
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import '../styles/register.css'

export default function Login() {

    const navigate = useNavigate()
    const [data, setData] = useState({
        email: '',
        password: '',
    })
  
    const loginUser = async (e) => {
        e.preventDefault()
        const {email, password} = data
        try{
          const{data} = await axios.post('/login', {
            email,
            password
          })

          if (data.error){
            toast.error(data.error)
          } else{
            setData({});
            navigate('/home')
          }
        }catch (error){
          
        }

    }
    
  return (
    <div>
       <div className="register-container">
          <div className="left-half">
            <h1 style={{ color: '#253D68', fontSize: 'xx-large' }}> Welcome back!</h1>
            <form onSubmit = {loginUser}>
            <div className="custom-input-container">
              <label className="custom-label">Email</label>
              <input className="custom-input" type='email' placeholder ='Please enter your email' value = {data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
            </div>  
            <div className="custom-input-container">
              <label className="custom-label">Password</label>
              <input className="custom-input" type='password' placeholder ='Please enter a password' value = {data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
            </div>  
                  <button type= 'submit' >Login</button>
            </form>
          </div>
          <div className="right-half"></div>
        </div>
    </div>
  )
}
