    import React, { useState, useEffect, useCallback } from 'react';
    import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
    import { useParams, Link } from "react-router-dom";
    import './SongDetails.css';
    import { useSongId } from '../hooks/useSongId';
import Header from '../Header/Header';

    export default function SongDetail() {
        const [song, setSong] = useState({});
        const [, setSongId] = useSongId();
        const { sID } = useParams();
        const [albums, setAlbums] = useState([]);
        const [songsBXH1, setSongsBXH1] = useState([]);
        const [artists, setArtists] = useState([]);
        const [isLiked, setIsLiked] = useState(false);
        const [likeId, setLikeId] = useState(null);
        const [user, setUser] = useState(null);
        const [feedback, setFeedback] = useState([]);
        const [newFeedback, setNewFeedback] = useState('');
        const [userId, setUserId] = useState(0); 

        useEffect(() => {
            handleSessionStorage();
        }, []);
        useEffect(() => {
            fetch(`https://yl28wx-8090.csb.app/feedback?songId=${sID}`)
                .then(res => res.json())
                .then(data => setFeedback(data))
                .catch(e => console.log(e));
        }, [sID]);
        const handleSessionStorage = () => {
            const storedUser = sessionStorage.getItem("user");

            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser); // Parse if it's a JSON string
                    setUser(parsedUser); // Set user state
                    setUserId(parsedUser.id);
                } catch (error) {
                    console.error('Error parsing stored user:', error);
                    // Handle parsing error if necessary
                }
            }
        };
        const handleFeedbackSubmit = async (e) => {
            e.preventDefault();
            if (!newFeedback.trim()) return;
    
            try {
                const response = await fetch('https://yl28wx-8090.csb.app/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        songId: sID,
                        userId: userId, // Ensure userId is passed correctly
                        comment: newFeedback,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to submit feedback');
                }
    
                const feedbackData = await response.json();
                setFeedback(prevFeedback => [...prevFeedback, feedbackData]);
                setNewFeedback('');
            } catch (error) {
                console.error('Error submitting feedback:', error);
            }
        };
        const fetchData = useCallback(async () => {
            try {
                const [artistsRes, albumsRes, songRes, allSongsRes, likesRes] = await Promise.all([
                    fetch(`https://yl28wx-8090.csb.app/artist`),
                    fetch(`https://yl28wx-8090.csb.app/albums`),
                    fetch(`https://yl28wx-8090.csb.app/listsongs/${sID}`),
                    fetch(`https://yl28wx-8090.csb.app/listsongs`),
                    user ? fetch(`https://yl28wx-8090.csb.app/like?userid=${user.id}`) : Promise.resolve({ json: () => [] })
                ]);
                
                const artistsData = await artistsRes.json();
                const albumsData = await albumsRes.json();
                const songData = await songRes.json();
                const allSongsData = await allSongsRes.json();
                const likesData = await likesRes.json();

                setArtists(artistsData);
                setAlbums(albumsData);
                setSong(songData);
                console.log(song);
                const acceptedSongs = allSongsData.filter(song => song.accept === 'yes');
                const topSongs = acceptedSongs.sort((a, b) => b.plays - a.plays).slice(0, 10);
                setSongsBXH1(topSongs);
                console.log(likesData);
                if (likesData.find(a => Number(a.trackid) === Number(sID))) {
                    setIsLiked(true);
                    setLikeId(likesData[0].id);
                } else {
                    setIsLiked(false);
                    setLikeId(null);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }, [sID, user]);

        useEffect(() => {
            fetchData();
        }, [fetchData]);

        useEffect(() => {
            setSongId(sID);
        }, [sID, setSongId]);

        const getArtistName = useCallback((artistID) => {
            const artist = artists.find(a => a.id === artistID);
            return artist ? artist.name : 'Unknown Artist';
        }, [artists]);

        const handleLike = async () => {
            try {
                if (isLiked) {
                    await fetch(`https://yl28wx-8090.csb.app/like/${likeId}`, { method: 'DELETE' });
                    setIsLiked(false);
                    setLikeId(null);
                } else {
                    const response = await fetch('https://yl28wx-8090.csb.app/like', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userid: user.id, trackid: parseInt(sID) }),
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
                <Row>
                    <Col md={8}>
                        <Row>
                            <Col>
                                <p style={{ fontSize: '1.5rem' }}><strong>{song.title}</strong></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p style={{ fontSize: '1.2rem' }}><strong>Ca sĩ: </strong>{getArtistName(song.artistID)}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p style={{ fontSize: '1.2rem' }}><strong>Thể loại: </strong>{song.categoryId}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p style={{ fontSize: '1.2rem' }}><strong>Lượt nghe: </strong>{song.plays}</p>
                            </Col>
                        </Row>
                        <Row className="icon-row" style={{ marginTop: "10px" }}>
                            <Col xs={6} />
                            <Col>
                                <i
                                    className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}
                                    style={{ padding: "5px", cursor: "pointer", color: isLiked ? 'red' : 'inherit' }}
                                    onClick={handleLike} 
                                /> Thêm Vào
                                <i className="bi bi-download" style={{ padding: "5px" }} /> Tải Nhạc
                                <i className="bi bi-share" style={{ padding: "5px" }} /> Chia Sẻ
                                <i className="bi bi-phone-vibrate" style={{ padding: "5px" }} /> Nhạc Chờ
                            </Col>
                        </Row>
                        <Row style={{ border: '1px solid', marginTop: "20px" }}>
                            <h3>Lời bài hát: {song.title}</h3>
                            <p>{song.artist}</p>
                            <p>[Verse:]</p>
                            <pre>{song.lyrics}</pre>
                        </Row>
                        
                    <Row>
                        <h3>Ý kiến của người nghe</h3>
                        <ul>
                            {feedback.map((fb, index) => {
                                
                                return (
                                    <li key={index}>
                                    <strong>{fb.userId === user?.id ? user.fullName : 'Unknown User'}:</strong> {fb.comment}
                                </li>
                                );
                            })}
                        </ul>
                        <Form onSubmit={handleFeedbackSubmit}>
                            <Form.Group controlId="feedbackForm">
                                <Form.Label>Gửi ý kiến của bạn:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newFeedback}
                                    onChange={(e) => setNewFeedback(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                                Gửi
                            </Button>
                        </Form>

                    </Row>
                        <Row style={{ lineHeight: "50px", marginTop: "20px" }}>
                            <Col md={3}><h1>Album</h1></Col>
                        </Row>
                        <hr />
                        <Row>
                            {albums.map((album) => (
                                <Col md={3} key={album.id}>
                                    <Card className="mb-4 album-card">
                                        <Card.Img variant="top" src={album.cover} className="album-card-img" />
                                        <Card.Body>
                                            <Card.Title className="album-card-title">{album.title}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col md={1} />
                    <Col md={3}>
                        <Row>
                            <h4>Nghe Tiếp</h4>
                        </Row>
                        {songsBXH1.map((s, index) => (
                            <Row key={s.id} className="my-2">
                                <Col md='2' className={`index-color-${index + 1}`}>{index + 1}</Col>
                                <Col>
                                    <Row>
                                        <Link to={`/song/${s.id}`}>{s.title}</Link>
                                    </Row>
                                    <Row>{s.artist}</Row>
                                </Col>
                            </Row>
                        ))}
                    </Col>
                </Row>
            </Container>
        );
    }
