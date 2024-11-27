import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/Homepage';
import Login from './Login/Login';
import Register from './Register/Register';
import Profile from './Profile/Profile';
import SongDetail from './SongDetails/SongDetails';



function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/Home' element={<HomePage />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/profile/:uID' element={<Profile />} />
          <Route path='/userprofile/:uID' element={<Profile />} />
          <Route path='/song/:sID' element={<SongDetail />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;