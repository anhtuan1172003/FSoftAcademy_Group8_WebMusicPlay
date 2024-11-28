import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Card } from "react-bootstrap";
import './Album.css';
import Header from "../Header/Header";
import { Link } from 'react-router-dom';

export default function Album() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:9999/albums`)
      .then(res => res.json())
      .then(data => setAlbums(data))
      .catch(e => console.log(e));
  }, []);
  return (
    <Container>
      <Row>
        <Header/>
      </Row>
      <Row style={{ lineHeight: "50px" }}>
        <Col md={3}><h1>Album</h1></Col>
      </Row>
      <hr />
      <Row>
        {albums.map((album, index) => (
          <Col key={index} md={3}>
            <Card className="mb-4 album-card">
              <Link to={`/songlist/${album.id}`}><Card.Img variant="top" src={album.cover} className="album-card-img" /></Link>
              <Card.Body>
                <Card.Title className="album-card-title">{album.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
