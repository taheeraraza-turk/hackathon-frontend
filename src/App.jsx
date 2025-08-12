import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileEditor from './pages/ProfileEditor';
import Preview from './pages/Preview';


export default function App(){
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') };

  return (
    <div>
     <nav className="nav">
  {isLoggedIn ? (
    <>
      <Link to="/">Preview</Link>
      <Link to="/edit">Edit Profile</Link>
      <button onClick={logout}>Logout</button>
    </>
  ) : (
    <>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  )}
</nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Preview/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/edit" element={<ProfileEditor/>} />
        </Routes>
      </main>
    </div>
  )
}
