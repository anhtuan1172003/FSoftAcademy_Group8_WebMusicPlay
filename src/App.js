import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/homepage';
import Login from './Login/Login';
import Register from './Register/Register';
import Profile from './Profile/Profile';
import AddSongArtist from './Artist/AddSong';
import ManageTableArtist from './Artist/ManagerSong';


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
          <Route path='/addSongA' element={<AddSongArtist />} />
          <Route path='/ManageTableArtist' element={<ManageTableArtist />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;