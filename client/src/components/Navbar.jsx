import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

export default function NavBar() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    setUser(null); // Reset the user state in the context
    navigate('/'); // Redirect to the home page
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FA4616', // Core Orange
    padding: '0', // Remove padding to ensure full height use
    boxShadow: `0 2px 5px rgba(0, 33, 165, 1.9)`, // Core Blue shadow
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '10px 15px', // Padding for links
    display: 'flex',
    alignItems: 'center'
  };

  const logoContainerStyle = {
    backgroundColor: '#0021A5', // Core Blue
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%', // 20% of the navbar
    height: '100%',
    padding: '13px 0' // Padding adjusted for vertical alignment
  };

  const logoTextStyle = {
    fontWeight: 'bold',
    fontSize: '24px',
    margin: '0' // Remove any default margins
  };

  const calendarIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  return (
    <nav style={navStyle}>
      <div style={logoContainerStyle}>
        <span style={logoTextStyle}>GatorFly</span>
      </div>
      <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
        <Link to='/calendar?login=success' style={linkStyle}>
          {calendarIcon}
        </Link>
        <div onClick={handleLogout} style={{...linkStyle, cursor: 'pointer'}}>Log Out</div>
      </div>
    </nav>
  );
}
