import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Playlist1.css';
import Headerhomepage from '../HomePage/Header';

const PlaylistComponent = () => {   
  const [playlist, setPlaylist] = useState([]);
  
  useEffect(() => {
    fetch(`http://localhost:9999/playlist/`)
      .then(res => res.json())
      .then(data => setPlaylist(data))
      .catch(e => console.log(e));
  }, []);

  return (
    <Container>
      <Headerhomepage />
      <div className="playlist-container">
        <h2 className="playlist-title">Playlist</h2>
        <Row>
          {playlist.map((playlistItem, index) => (
            <Col key={index} md={4} lg={3} sm={6} xs={12}>
              <Card className="playlist-card">
                <a href={`/playListDetail/${playlistItem.id}`}>
                  <Card.Img
                    className="playlist-card-img"
                    variant="top"
                    src={playlistItem.img || 'default-image-url.jpg'}
                    alt={playlistItem.name}
                  />
                </a>
                <Card.Body className="playlist-card-body">
                  <Card.Title className="playlist-card-title">
                    <a href={`/playListDetail/${playlistItem.id}`}>
                      {playlistItem.title}
                    </a>
                  </Card.Title>
                  <Card.Text className="playlist-card-text">{playlistItem.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default PlaylistComponent;