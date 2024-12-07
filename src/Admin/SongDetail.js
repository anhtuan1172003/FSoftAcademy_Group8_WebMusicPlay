import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';

const SongDetailad = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [artist, setArtist] = useState([]);
  const [categories, setCategories] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    // Fetch the song details
    fetch(`https://yvkjyc-8080.csb.app/listsongs/${id}`)
      .then(response => response.json())
      .then(data => setSong(data))
      .catch(error => console.error('Error fetching song details:', error));

    // Fetch artist details
    fetch('https://yvkjyc-8080.csb.app/artist')
      .then(response => response.json())
      .then(data => setArtist(data))
      .catch(error => console.error('Error fetching artists:', error));

    // Fetch category details
    fetch('https://yvkjyc-8080.csb.app/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, [id]);

  if (!song) {
    return <div>Loading...</div>;
  }

  const artistName = artist.find(a => a.id === song.artistID)?.name || "Unknown Artist";
  const categoryName = categories.find(c => c.id === song.categoryId)?.name || "Unknown Category";

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleToggleAccept = () => {
    const newAcceptStatus = song.accept === 'yes' ? 'no' : 'yes';
    fetch(`https://yvkjyc-8080.csb.app/listsongs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...song, accept: newAcceptStatus })
    })
      .then(response => response.json())
      .then(updatedSong => setSong(updatedSong))
      .catch(error => console.error('Error updating song accept status:', error));
  };

  return (
    <Container>
      <Row>
        <Col>
          <Image src={song.imgSrc} alt={song.title} thumbnail />
        </Col>
        <Col>
          <h2>{song.title}</h2>
          <p><strong>Artist:</strong> {artistName}</p>
          <p><strong>Category:</strong> {categoryName}</p>
          <p><strong>Plays:</strong> {song.plays}</p>
          <p><strong>Ranking:</strong> {song.ranking}</p>
          <p><strong>Lyrics:</strong> {song.lyrics}</p>
          <audio controls>
            <source src={song.src} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <Button onClick={handleToggleAccept}>
            {song.accept === 'yes' ? 'Mark as Unaccepted' : 'Mark as Accepted'}
          </Button>
          <Link to="/admin">
            <Button>Back to Manage</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default SongDetailad;
