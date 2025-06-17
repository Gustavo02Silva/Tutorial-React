import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const url = "http://127.0.0.1:8000"; 

  const login = async (username, password) => {
    const response = await axios.post(`${url}/login/`, { username, password });
    localStorage.setItem('token', response.data.access_token);
    setUser({ username });
    navigate('/');
  };
  
  const register = async (username, email, password) => {
    console.log({ username, email, password });
    await axios.post(`${url}/register/`, { username , email, password });
    navigate('/login'); 
  };
  
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({});
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);