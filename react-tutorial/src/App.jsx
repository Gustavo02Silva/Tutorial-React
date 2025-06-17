import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Post from './components/Posts';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
     <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Post /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
