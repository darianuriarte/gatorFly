import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      axios.get('/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          if (data) setUser(data);
        })
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
