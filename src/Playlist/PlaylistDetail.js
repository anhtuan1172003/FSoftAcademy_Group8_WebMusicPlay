import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useSongId } from '../hooks/useSongId';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';

export default function PlaylistDetail() {
  const { pid } = useParams();
  const [artists, setArtists] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [songplay, setSongplay] = useState(null);
  const [sid, setSongId] = useSongId();
  const [albums, setAlbums] = useState([]);
  const [songsBXH1, setSongsBXH1] = useState([]);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    handleSessionStorage();
  }, []);
  useEffect(() => {    
    fetch("https://dsqkll-8090.csb.app/categories")
      .then(res => res.json())
      .then(result => {
        setCategories(result);
      })
      .catch(error => console.log(error));
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
      const [artistsRes, playlistRes, albumsRes, songsRes, likesRes] = await Promise.all([
        fetch('https://dsqkll-8090.csb.app/artist').then(res => res.json()),
        fetch(`https://dsqkll-8090.csb.app/playlist/${pid}`).then(res => res.json()),
        fetch('https://dsqkll-8090.csb.app/albums').then(res => res.json()),
        fetch('https://dsqkll-8090.csb.app/listsongs').then(res => res.json()),
        user ? fetch(`https://dsqkll-8090.csb.app/like?userid=${user.id}`).then(res => res.json()) : Promise.resolve([])
      ]);

      setArtists(artistsRes);
      setPlaylist(playlistRes);
      setAlbums(albumsRes);
      
      // const acceptedSongs = songsRes.filter(song => song.accept === 'yes');
      const topSongs = songsRes.sort((a, b) => b.plays - a.plays).slice(0, 10);
      const playlistSongs = songsRes.filter(song => playlistRes.listsongid.includes(song.id.toString()));
      setSongs(playlistSongs);
      setSongsBXH1(topSongs);

      if (playlistSongs.length > 0) {
        setSongplay(playlistSongs[0]);
        setSongId(playlistSongs[0].id);
      }

      if (likesRes.find(a => Number(a.trackid) === Number(sid))) {
        setIsLiked(true);
        setLikeId(likesRes[0].id);
      } else {
        setIsLiked(false);
        setLikeId(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [pid, setSongId, user,sid]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSongId(sid);
}, [sid, setSongId]);

  const onSongClick = (id) => {
    setCurrentPlayingId(id);
    handleSongClick(id);
  };

  const getArtistName = useCallback((artistId) => {
    const artist = artists.find(a => a.id === artistId);
    return artist ? artist.name : 'Unknown Artist';
  }, [artists]);

  const handleSongClick = (id) => {
    const selectedSong = songs.find(song => song.id == id);
    if (selectedSong) {
      setSongplay(selectedSong);
      setSongId(id);
    }
  };

  const handleLike = async () => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    try {
      if (isLiked) {
        await fetch(`https://dsqkll-8090.csb.app/like/${likeId}`, { method: 'DELETE' });
        setIsLiked(false);
        setLikeId(null);
      } else {
        const response = await fetch('https://dsqkll-8090.csb.app/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userid: user.id, trackid: parseInt(songplay.id) }),
        });
        const newLike = await response.json();
        setIsLiked(true);
        setLikeId(newLike.id);
      }
    } catch (error) {
      console.error(`Error ${isLiked ? 'unliking' : 'liking'} the song:`, error);
    }
  };

  return (
    <Container>
      <Row>
        <Header/>
      </Row>
      {playlist && (
        <Row>
          <Col md={4}>
            <img src={playlist.img} alt={playlist.title} style={{width: '100%', height: 'auto'}} />
          </Col>
          <Col md={8}>
            <h2>{playlist.title}</h2>
            <p>{playlist.description}</p>
          </Col>
        </Row>
      )}
      <Row>
        <Col md={8}>
          {songs.map((s, index) => (
            <Row key={s.id} style={{ border: "1px solid black", marginTop: "10px" }}>
              <Col>
                <p onClick={() => onSongClick(s.id)}>
                  {currentPlayingId == s.id && <i className="bi bi-play-fill play-icon" style={{ padding: "5px" }}></i>}
                  {index + 1}. {s.title} - {getArtistName(s.artistID)}
                </p>
              </Col>
            </Row>
          ))}
          {songplay && (
            <>
              <Row>
                <Col>
                  <p style={{ fontSize: '1.5rem' }}><strong>{songplay.title}</strong></p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: '1.2rem' }}><strong>Nhạc sĩ:</strong> {getArtistName(songplay.artistID)}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: '1.2rem' }}><strong>Thể loại:</strong> {categories?.find(c => c.id == songplay.categoryId)?.name}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: '1.2rem' }}><strong>Lượt nghe:</strong> {songplay.plays}</p>
                </Col>
              </Row>
              <Row className="icon-row" style={{ marginTop: "10px" }}>
                <Col>
                  <i
                    className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}
                    style={{ padding: "5px", cursor: "pointer", color: isLiked ? 'red' : 'inherit' }}
                    onClick={handleLike}
                  /> Thêm Vào
                  <i className="bi bi-download" style={{ padding: "5px" }}/> Tải Nhạc
                  <i className="bi bi-share" style={{ padding: "5px" }}/> Chia Sẻ
                  <i className="bi bi-phone-vibrate" style={{ padding: "5px" }}/> Nhạc Chờ
                </Col>
              </Row>
            </>
          )}
          <Row style={{ border: '1px solid', marginTop: "20px" }}>
            <h3> Lời bài hát: {songplay ? songplay.title : ''}</h3>
            <p>Nhạc sĩ : {songplay ? getArtistName(songplay.artistID) : ''}</p>
            <p>[Verse:]</p>
            <pre>{songplay ? songplay.lyrics : ''}</pre>
            <Link to=''>Xem toàn bộ</Link>
          </Row>
          <Row style={{ lineHeight: "50px", marginTop: "20px" }}>
            <Col md={3}><h1>Album</h1></Col>
          </Row>
          <hr />
          <Row>
            {albums.map((album, idx) => (
              <Col md={3} key={idx} >
                <Card className="mb-4 album-card">
                  <Link to={`/songlist/${album.id}`}>
                    <Card.Img variant="top" src={album.cover} className="album-card-img" />
                  </Link>
                  <Card.Body>
                    <Card.Title className="album-card-title">{album.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={1}>
        </Col>
        <Col md={3}>
          <Row>
            <h4>Nghe Tiếp</h4>
          </Row>
          {songsBXH1.map((s, index) => (
            <Row key={index} className="my-2">
              <Col md='2' className={`index-color-${index + 1}`}>{index + 1}</Col>
              <Col>
                <Row>
                  <Link to={`/song/${s.id}`}>{s.title}</Link>
                </Row>
                <Row>{getArtistName(s.artistID)}</Row>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </Container>
  );
}