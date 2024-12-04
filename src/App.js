import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import HomePage from './HomePage/homepage';
import Ranking from './BXH/BXH';
import Album from './Album/Album';
import SongDetail from './SongDetails/SongDetails';
import Login from './Login/Login';
import Register from './Register/Register';
import MusicPlayer from './MusicPlayer';
import SongList from './SongLists/SongList';
import Profile from './Profile/Profile';
import ManageTable from './Admin/Manage';
import AddSong from './Admin/AddSong';
import EditSong from './Admin/EditSong';
import PlaylistAddForm from './Playlist/addPlayList';
import PlaylistUpdateForm from './Playlist/editPlayList';
import Admin from './Admin/Admin';
import ManageAlbums from './Admin/ManageAlbum';
import ManageArtists from './Admin/ManageArtist';
import PlaylistComponent from './Playlist/Playlist';
import SongDetailad from './Admin/SongDetail';
import Checkout from './checkout';
import PremiumSubscription from './Premium';
import AdminDashboard from './dashboard/AdminDashboard'
import ArtistDashboard from './dashboard/ArtistDashboard'
import LoginArtist from './Login/LoginArtist';
import ManageTableArtist from './Artist/ManagerSong';
import AddSongArtist from './Artist/AddSong';
import PlaylistDetail from './Playlist/PlaylistDetail';
import Search from './HomePage/Search';
import ManageFB from './Admin/ManageFeedBack';

const initialOptions = {
  "client-id": "AXopNHfJ6E_snH6NGvirbRzvu8p52V3wkHYhPlm8w0b4NWZBMZ8lFNfEa0NqOx75LEeAa9uqYEGTL0uV",
  currency: "USD",
  intent: "capture",
};

function App() {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/Home' element={<HomePage />} />
          <Route path='/BXH' element={<Ranking />} />
          <Route path='/Album' element={<Album />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/song/:sID' element={<SongDetail />} />
          <Route path='/songlist/:aID' element={<SongList />} />
          <Route path='/profile/:uID' element={<Profile />} />
          <Route path='/admin' element={<ManageTable />} />
          <Route path='/addsong' element={<AddSong />} />
          <Route path='/edit/:eId' element={<EditSong />} />
          <Route path='/userprofile/:uID' element={<Profile />} />
          <Route path='/addPlaylist' element={<PlaylistAddForm />} />
          <Route path='/editplaylist/:pID' element={<PlaylistUpdateForm />} />
          <Route path='/Admin' element={<Admin />} />
          <Route path='/ManageAlbum' element={<ManageAlbums />} />
          <Route path='/ManageSong' element={<ManageTable />} />
          <Route path='/ManageArtist' element={<ManageArtists />} />
          <Route path='/playList' element={<PlaylistComponent />} />
          <Route path='/playListDetail/:pid' element={<PlaylistDetail />} />
          <Route path="/listsongs/:id" element={<SongDetailad />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path='/premium' element={<PremiumSubscription />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/artistDashboard" element={<ArtistDashboard />} />

          <Route path='/premium/:uID' element={<PremiumSubscription />} />
          <Route path='/logina' element={<LoginArtist />} />
          <Route path='/ManageTableArtist' element={<ManageTableArtist />} />
          <Route path='/addSongA' element={<AddSongArtist />} />
          <Route path='/Search/:search' element={<Search />} />
          <Route path='/ManageFeedback' element={<ManageFB />} />
        </Routes>
        <MusicPlayer />
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;