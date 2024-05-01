import axios from "axios";
import { createContext, useState, useEffect } from "react";

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/profile', {
          headers: { Authorization: token },
        })
        .then(({ data }) => {
          setUser(data);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
