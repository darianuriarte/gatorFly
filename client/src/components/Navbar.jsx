import {Link} from 'react-router-dom'
import '../styles/navbar.css'
export default function Navbar(){
    return (
        <nav>
            <Link to= '/home'>Home</Link>
            <Link to= '/register'>Register</Link>
            <Link to= '/login'>Login</Link>
        </nav>
        
    )
}