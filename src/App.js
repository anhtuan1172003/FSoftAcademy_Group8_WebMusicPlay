import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/Homepage';
import Login from './Login/Login';
import Register from './Register/Register';
import Profile from './Profile/Profile';
import SongDetail from './SongDetails/SongDetails';
<<<<<<< Updated upstream


=======
import AddSongArtist from './Artist/AddSong';
import ManageTableArtist from './Artist/ManagerSong';
import Ranking from './BXH/BXH';
import Album from './Album/Album';
import AdminDashboard from './dashboard/AdminDashboard'
import ArtistDashboard from './dashboard/ArtistDashboard'
import SongList from './SongLists/SongList';
import PlaylistAddForm from './Playlist/addPlayList';
import PlaylistUpdateForm from './Playlist/editPlayList';
import PlaylistComponent from './Playlist/Playlist';
import PlaylistDetail from './Playlist/PlaylistDetail';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
          <Route path='/addSongA' element={<AddSongArtist />} />
          <Route path='/ManageTableArtist' element={<ManageTableArtist />} />
          <Route path='/BXH' element={<Ranking />} />
          <Route path='/Album' element={<Album />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/artistDashboard" element={<ArtistDashboard />} />
          <Route path='/songlist/:aID' element={<SongList />} />
          <Route path='/addPlaylist' element={<PlaylistAddForm />} />
          <Route path='/editplaylist/:pID' element={<PlaylistUpdateForm />} />
          <Route path='/playList' element={<PlaylistComponent />} />
          <Route path='/playListDetail/:pid' element={<PlaylistDetail />} />
          
>>>>>>> Stashed changes
        </Routes>
      </BrowserRouter>
  );
}

export default App;