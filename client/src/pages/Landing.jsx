import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        // Redirect to the login page
        navigate('/login');
    };

    const handleSignUpClick = () => {
        // Redirect to the sign up page
        navigate('/register');
    };

    return (
        <div className="landing-container">

            <h1 className="landing-heading">GatorFly</h1>
            <p className="landing-p">Traveling is easier than ever</p>
            <button className="login-button" onClick={handleLoginClick}>Login</button>
            <button className="sign-button" onClick={handleSignUpClick}>Sign Up</button>

        </div>
    );
}

