import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, ListGroup, InputGroup, FormControl, Container } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import './PlaylistUpdateForm.css';
import Header from '../Header/Header';
import { v4 } from "uuid";
import { imgDB } from "../Firebase/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const PlaylistAddForm = () => {
    const [playlistName, setPlaylistName] = useState('');
    const [singer, setSinger] = useState('');
    const [category, setCategory] = useState([]);
    const [image, setImage] = useState("");
    const [description, setDescription] = useState('');
    const [songs, setSongs] = useState([]);
    const [songSearch, setSongSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isUploadingImg, setIsUploadingImg] = useState(false);
    

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser); // Parse if it's a JSON string
                setUser(parsedUser); // Set user state
            } catch (error) {
                console.error('Error parsing stored user:', error);
                // Handle parsing error if necessary
            }
        }
    }, []);

   

    const handleSongSearchChange = (e) => {
        setSongSearch(e.target.value);
    };

    useEffect(() => {
        fetch(`https://dsqkll-8090.csb.app/categories`)
            .then(res => res.json())
            .then(data => setCategory(data))
            .catch(e => console.log(e));
    }, []);

    useEffect(() => {
        if (songSearch.trim() !== '') {
            fetch(`https://dsqkll-8090.csb.app/listsongs`)
                .then(res => res.json())
                .then(data => {
                    const filteredSongs = data.filter(p => p.title.toLowerCase().includes(songSearch.toLowerCase()));
                    setSearchResult(filteredSongs);
                })
                .catch(e => console.log(e));
        } else {
            setSearchResult([]);
        }
    }, [songSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const songIds = songs.map(song => song.id);
        const newPlayList = {
            title: playlistName,
            userid: user.id,
            img: image,
            description: description,
            listsongid: songIds
        };
        fetch("https://dsqkll-8090.csb.app/playlist", {
            method: "POST",
            body: JSON.stringify(newPlayList),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then(resp => resp.json())
            .then(productCreated => {
                alert("Create success! Id: " + productCreated.id);
                window.location.href = `/userprofile/${user.id}`;
            })
            .catch(err => console.log(err));

        console.log({ playlistName, image, description, songs });
    };

    const removeSong = (index) => {
        setSongs(songs.filter((_, i) => i !== index));
    };

    const addSong = (song) => {
        if (!songs.some(s => s.id === song.id)) {
            setSongs([...songs, song]);
            setSongSearch('');
        }
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imgRef = ref(imgDB, `playlistimages/${file.name}_${v4()}`);
            setIsUploadingImg(true);
            try {
                const snapshot = await uploadBytes(imgRef, file);
                const url = await getDownloadURL(snapshot.ref);
                setImage(url);
                setIsUploadingImg(false);
            } catch (error) {
                console.error("Error uploading image: ", error);
                setIsUploadingImg(false);
            }
        }
    };

    return (
        <Container>
            <Row>
                <Header />
            </Row>
            <div className="form-container">

                <h1 className="form-title">Thêm PLAYLIST</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} controlId="formPlaylistName">
                        <Form.Label column sm={2} className="form-label">Tên Playlist</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                placeholder="Tên Playlist"
                                className="form-control"
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formImage">
                        <Form.Label column sm={2} className="form-label">Cover playlist</Form.Label>
                        <Col sm={10}>
                            <FormControl type="file" onChange={handleImageUpload} />
                            {image && <img src={image} alt="Preview" style={{ marginTop: "10px", maxWidth: "200px" }} />}
                            <Form.Text className="form-text">
                                (Hình tối thiểu 500 x 500 pixels)
                            </Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formDescription">
                        <Form.Label column sm={2} className="form-label">Mô tả</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả"
                                className="form-control"
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formSongs">
                        <Form.Label column sm={2} className="form-label">Danh sách bài hát</Form.Label>
                        <Col sm={10}>
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Nhập từ khóa hoặc link bài hát"
                                    value={songSearch}
                                    onChange={handleSongSearchChange}
                                />
                            </InputGroup>
                            <ListGroup>
                                {searchResult.map((song, index) => (
                                    <ListGroup.Item key={index}>
                                        {song.title}
                                        <Button variant="outline-secondary" onClick={() => addSong(song)} className="float-end">
                                            Thêm
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <ListGroup>
                                {songs.map((song, index) => (
                                    <ListGroup.Item key={index}>
                                        {song.title}
                                        <Button variant="danger" size="sm" onClick={() => removeSong(index)} className="float-end">
                                            Xóa
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="btn-primary">Cập nhật</Button>
                </Form>
            </div>
        </Container>
    );
};

export default PlaylistAddForm;
