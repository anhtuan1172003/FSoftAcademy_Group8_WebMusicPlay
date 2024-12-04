import { Container, Row, Col, Card } from 'react-bootstrap';
import BXH from './BXH';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export default function Search() {
    const [songLists, setSongLists] = useState([]);
    const { search } = useParams();
    console.log(search);

    useEffect(() => {
        fetch("http://localhost:9999/listsongs")
            .then(res => res.json())
            .then(data => setSongLists(data))
            .catch(error => console.log(error));
    }, []);

    console.log(songLists);
    const filteredSongs = songLists.filter(song => song.title.toLowerCase().includes(search.toLowerCase()));
    const totalResults = filteredSongs.length; // Tính tổng số kết quả tìm được
    console.log(filteredSongs);

    return (
        <Container>
            <Row>
                <Header/>
            </Row>
            <Container style={{ marginTop: "50px" }}>
                <Row>
                    <Col md={8}>
                        <Row>
                            <h3>TÌM KIẾM</h3>
                        </Row>
                        <Row>
                            <hr />
                        </Row>
                        <Row>
                            <h4>Bài hát</h4>
                            <p>Tổng số kết quả tìm được: {totalResults}</p> {/* Hiển thị tổng số kết quả */}
                            {totalResults > 0 ? (
                                <ul>
                                    {filteredSongs.map((song) => (
                                        <Card style={{width:'210px',marginBottom:'10px'}}>
                                            <Card.Img variant="top" src={song.imgSrc} style={{ width: "210px" }} />
                                            <Card.Body>
                                                <Card.Title>
                                                    <Link to={`/song/${song.id}`}><p>{song.title}</p></Link>
                                                </Card.Title>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </ul>
                            ) : (<>
                                <p>Không có kết quả tìm kiếm phù hợp.</p>
                            </>
                            )}
                        </Row>
                    </Col>
                    <Col md={4}>
                        <BXH />
                    </Col>
                </Row>
            </Container>
            <Row>
                <Footer/>
            </Row>
        </Container>
    );
}