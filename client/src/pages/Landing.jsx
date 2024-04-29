import { useNavigate } from 'react-router-dom';
import '../styles/landing.css'

export default function Landing() {
    return (
        <div className="landing-container">
            <div>
                <h1 style={{color: 'white', marginLeft: '40px'}} >Welcome to GatorFly</h1>
            </div>
        </div>
    );
}
