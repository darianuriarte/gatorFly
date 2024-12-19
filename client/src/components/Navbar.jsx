import { Link } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar() {
    return (
        <nav>
            <Link className="gatorfly" to="/">Gatorfly</Link>
            <div className="right-links">
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    );
}

