import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize a loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          setUser(data); // Set the user data
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          setLoading(false); // Ensure loading is set to false even if there is an error
        });
    } else {
      setLoading(false); // Set loading to false if there is no token
    }
  }, []); // Remove user from the dependency array

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {loading ? <div>Loading...</div> : children} 
    </UserContext.Provider>
  );
}
