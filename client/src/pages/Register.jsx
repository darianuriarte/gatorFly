import {useState } from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import '../styles/register.css'

export default function Register() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    })

const registerUser =  async (e) => {
    e.preventDefault()
    const {name, email, password} = data
    try {
        const {data} = await axios.post('/register', {
            name, email, password
        })
        if (data.error){
            toast.error(data.error)
        } else{
            //Reset input fields
            setData({})
            toast.success('Account registered sucessfully')
            navigate('/login')
        }
    } catch (error){
        console.log(error)
        
    }
}


return (
    <div className="register-container">
        <div className="left-half">
            <h1 style={{ color: '#253D68', fontSize: 'xx-large' }}>Welcome to Gatorfly</h1>
            <form onSubmit={registerUser}>
                <div className="custom-input-container">
                    <label className="custom-label">Name</label>
                    <input className="custom-input" type='text' placeholder='Please enter your name' value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                </div>
                <div className="custom-input-container">
                    <label className="custom-label">Email</label>
                    <input className="custom-input" type='email' placeholder='Please enter your email' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                </div>
                <div className="custom-input-container">
                    <label className="custom-label">Password</label>
                    <input className="custom-input" type='password' placeholder='Please enter a password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                </div>
                <button type='submit'>Submit</button>
            </form>
        </div>
        <div className="right-half"></div>
    </div>
)
}
