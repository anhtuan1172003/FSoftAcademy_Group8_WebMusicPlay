import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Image, Nav, Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { useParams, Link } from "react-router-dom";
import Header from '../Header/Header';

export default function Profile() {
  const [user, setUser] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const { uID } = useParams();
  const [activeTab, setActiveTab] = useState('playlist');
  const [likedSongs, setLikedSongs] = useState([]);
  const [likedSongs1, setLikedSongs1] = useState([]);
  const [artists, setArtists] = useState([]);

  const fetchArtists = useCallback(() => {
    fetch(`https://dsqkll-8090.csb.app/artist`)
      .then(res => res.json())
      .then(data => setArtists(data))
      .catch(e => console.log(e));
  }, []);

  const fetchPlaylists = useCallback(() => {
    fetch(`https://dsqkll-8090.csb.app/playlist`)
      .then(res => res.json())
      .then(data => {
        const data1 = data.filter(p => p.userid === uID);
        setPlaylist(data1);
      })
      .catch(e => console.log(e));
  }, [uID]);

  const fetchLikedSongs = useCallback(() => {
    fetch(`https://dsqkll-8090.csb.app/like`)
      .then(res => res.json())
      .then(data => {
        const likedData = data.filter(l => l.userid === uID);
        setLikedSongs(likedData);
      })
      .catch(e => console.log(e));
  }, [uID]);

  const fetchSongDetails = useCallback(() => {
    fetch(`https://dsqkll-8090.csb.app/listsongs`)
      .then(res => res.json())
      .then(data => {
        const filteredSongs = data.filter(song => likedSongs.some(ls => ls.trackid == song.id));
        setLikedSongs1(filteredSongs);
      })
      .catch(error => console.error('Error fetching and filtering songs:', error));
  }, [likedSongs]);

  useEffect(() => {
    fetchArtists();
    fetchPlaylists();
    fetchLikedSongs();
  }, [fetchArtists, fetchPlaylists, fetchLikedSongs]);

  useEffect(() => {
    fetchSongDetails();
  }, [fetchSongDetails]);

  const handleDeletePlaylist = (id) => {
    fetch(`https://dsqkll-8090.csb.app/playlist/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(() => {
        setPlaylist(playlist.filter(pl => pl.id !== id));
      })
      .catch(e => console.log(e));
  };

  const handleDeleteLikeSong = (likeId) => {
    fetch(`https://dsqkll-8090.csb.app/like/${likeId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(() => {
        setLikedSongs(likedSongs.filter(ls => ls.id !== likeId));
      })
      .catch(e => console.log(e));
  };

  const handleEditPlaylist = (id) => {
    window.location.href = `/editplaylist/${id}`;
  };

  const getArtistName = useCallback((artistID) => {
    const artist = artists.find(a => a.id === artistID);
    return artist ? artist.name : 'Unknown Artist';
  }, [artists]);

  useEffect(() => {
    fetch(`https://dsqkll-8090.csb.app/users/${uID}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(e => console.log(e));
  }, [uID]);

  return (
    <div>
    <Container>
      <Row>
        <Header />
      </Row>
      </Container>
      <Row className="justify-content-center text-center py-5" style={{ backgroundImage: `url(/images/anhnencanhan.jpg)`, backgroundSize: 'cover', color: 'white' }}>
        <Col md={2} style={{paddingLeft: "50px"}}>
          <Image src={"/images/avataruser.png"} roundedCircle style={{ width: '150px', height: '150px' }} />
          <h3>{user.fullName}</h3>
          <p>ID: {user.id}</p>
          <p>Gender: {user.Gender}</p>
        </Col>
        <Col></Col>
      </Row>
      <Container>
        <Nav justify variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
          <Nav.Item>
            <Nav.Link eventKey="playlist">Playlist</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="liked">Liked</Nav.Link>
          </Nav.Item>
        </Nav>

        <Row className="mt-4">
          {activeTab === 'playlist' && (
            <Row>
            <Col md={8} className="mb-3">
              <Link to={`/addPlaylist`}>
                <Button variant="primary">Add Playlist</Button>
              </Link>
            </Col>
            </Row>
          )}
          {activeTab === 'playlist' && playlist.map((pl, idx) => (
            <Row>
            <Col key={idx} md={4} className="mb-4 d-flex justify-content-center">
                <Card style={{width: "18rem", height: "22rem"}}>
                  <Card.Img variant="top" src={pl.img} style={{ objectFit: "cover", height: "auto" }} />
                  <Card.Body>
                    <Link to={`/playListDetail/${pl.id}`}><Card.Title>{pl.title}</Card.Title></Link>
                    <Button variant="warning" onClick={() => handleEditPlaylist(pl.id)} style={{ marginRight: "10px" }}>Chỉnh sửa</Button>
                    <Button variant="danger" onClick={() => handleDeletePlaylist(pl.id)}>Xóa</Button>
                  </Card.Body>
                </Card>
            </Col>
            </Row>
          ))}
          {activeTab == 'liked' && likedSongs1.map((song, idx) => {
            const likeInfo = likedSongs.find(ls => ls.trackid == song.id);
            return (
              <Col md={8} key={idx}>
                <Row className="mb-3">
                  <Col>
                    <Image src={song.imgSrc} thumbnail />
                  </Col>
                  <Col>
                    <Link to={`/song/${song.id}`}>
                      <p>{song.title} - {getArtistName(song.artistID)}</p>
                    </Link>
                  </Col>
                  <Col>
                    <Button variant="danger" onClick={() => handleDeleteLikeSong(likeInfo.id)}>Xóa</Button>
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}