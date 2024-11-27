import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Headerhomepage from "../HomePage/Header";

const Ranking = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    handleSessionStorage();
  }, []);

  const handleSessionStorage = () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const [artistsRes, songsRes, likesRes] = await Promise.all([
        fetch('http://localhost:9999/artist').then(res => res.json()),
        fetch('http://localhost:9999/listsongs').then(res => res.json()),
        user ? fetch(`http://localhost:9999/like?userid=${user.id}`).then(res => res.json()) : Promise.resolve([])
      ]);

      setArtists(artistsRes);
      
      const acceptedSongs = songsRes.filter(song => song.accept === 'yes');
      const topSongs = acceptedSongs.sort((a, b) => b.plays - a.plays).slice(0, 10);
      
      const songsWithLikes = topSongs.map(song => ({
        ...song,
        isLiked: likesRes.some(like => Number(like.trackid) === song.id),
        likeId: likesRes.find(like => Number(like.trackid) === song.id)?.id
      }));

      setSongs(songsWithLikes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getArtistName = useCallback((artistId) => {
    const artist = artists.find(a => a.id === artistId);
    return artist ? artist.name : 'Unknown Artist';
  }, [artists]);

  const handleLike = async (index) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    const updatedSongs = [...songs];
    const song = updatedSongs[index];

    try {
      if (song.isLiked) {
        await fetch(`http://localhost:9999/like/${song.likeId}`, { method: 'DELETE' });
        song.isLiked = false;
        song.likeId = null;
      } else {
        const response = await fetch('http://localhost:9999/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userid: user.id, trackid: song.id }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const newLike = await response.json();
        song.isLiked = true;
        song.likeId = newLike.id;
      }
      setSongs(updatedSongs);
    } catch (error) {
      console.error(`Error ${song.isLiked ? 'unliking' : 'liking'} the song:`, error);
    }
  };

  return (
    <Container>
      <Row>
        <Headerhomepage />
      </Row>
      <Row>
        <h2 className="my-4">Bảng xếp hạng Trending Music</h2>
      </Row>
      <Row>
        <ListGroup>
          {songs.map((song, index) => (
            <ListGroup.Item key={song.id}>
              <Row>
                <Col xs={1} className="text-center">
                  <h2>{index + 1}</h2>
                </Col>
                <Col xs={2}>
                  <Image src={song.imgSrc} thumbnail alt={song.title} />
                </Col>
                <Col xs={7}>
                  <h2>{song.title}</h2>
                  <p>{getArtistName(song.artistID)}</p>
                </Col>
                <Col xs={2}>
                  <Row>
                    <Col xs={4}>
                     
                    </Col>
                    <Col xs={4}>
                      <Link to={`/song/${song.id}`}>
                        <h4><i className="bi bi-play-circle"></i></h4>
                      </Link>
                    </Col>
                    <Col xs={4}><h4><i className="bi bi-share"></i></h4></Col>
                  </Row>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
    </Container>
  );
};

export default Ranking;