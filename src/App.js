import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/homepage';
import Login from './Login/Login';
import LoginArtist from './Login/LoginArtist';
import Register from './Register/Register';
import Profile from './Profile/Profile';
import SongDetail from './SongDetails/SongDetails';
import AddSongArtist from './Artist/AddSong';
import ManageTableArtist from './Artist/ManagerSong';
import Ranking from './BXH/BXH';
import Album from './Album/Album';
import AdminDashboard from './dashboard/AdminDashboard'
import ArtistDashboard from './dashboard/ArtistDashboard'


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/Home' element={<HomePage />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/logina' element={<LoginArtist />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/profile/:uID' element={<Profile />} />
          <Route path='/userprofile/:uID' element={<Profile />} />
          <Route path='/song/:sID' element={<SongDetail />} />
          <Route path='/addSongA' element={<AddSongArtist />} />
          <Route path='/ManageTableArtist' element={<ManageTableArtist />} />
          <Route path='/BXH' element={<Ranking />} />
          <Route path='/Album' element={<Album />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/artistDashboard" element={<ArtistDashboard />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;