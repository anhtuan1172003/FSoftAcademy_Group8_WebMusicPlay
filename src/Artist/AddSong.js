import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, FormSelect, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function AddSongArtist() {
    const [title, setTitle] = useState("");
    const [img, setImg] = useState("");
    const [src, setSrc] = useState("");
    const [categoryId, setCatId] = useState("0");
    const [albumId, setAlbumId] = useState("0");
    const [categories, setCategories] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [lyrics, setLyrics] = useState("");
    const [loggedInArtist, setLoggedInArtist] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userJson = sessionStorage.getItem('artist');
        if (userJson) {
            const user = JSON.parse(userJson);
            setLoggedInArtist(user);
            
            // Fetch categories
            fetch("http://localhost:9999/categories")
                .then(res => res.json())
                .then(result => setCategories(result))
                .catch(error => console.log(error));

            // Fetch albums by the logged-in artist
            fetch(`http://localhost:9999/albums?artistID=${user.id}`)
                .then(res => res.json())
                .then(result => setAlbums(result))
                .catch(error => console.log(error));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImg(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    function handleCreate(e) {
        e.preventDefault();
        let message = "";
        let status = true;

        if (title.trim().length === 0) {
            message += "Song title is required\n";
            status = false;
        }
        if (categoryId === "0") {
            message += "You must choose a category!\n";
            status = false;
        }
        if (albumId === "0") {
            message += "You must choose an album!\n";
            status = false;
        }
        if (!status) {
            alert(message);
        } else {
            const newSong = {
                title: title.trim(),
                imgSrc: img,
                src: src,
                artistID: loggedInArtist.id,
                plays: 0,
                AlbumID: parseInt(albumId),
                lyrics: lyrics.trim(),
                categoryId: parseInt(categoryId),
            };

            fetch("http://localhost:9999/listsongs", {
                method: "POST",
                body: JSON.stringify(newSong),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(resp => resp.json())
                .then(songCreated => {
                    alert("Song created successfully! Id: " + songCreated.id);
                    navigate('/ManageTableArtist');
                })
                .catch(err => console.log(err));
        }
    }

    if (!loggedInArtist) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h3 style={{ textAlign: "center" }}>Add a New Song</h3>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    <Link to="/ManageTableArtist">Back to My Songs</Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={handleCreate}>
                        <FormGroup>
                            <FormLabel>Title</FormLabel>
                            <FormControl required onChange={e => setTitle(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Image</FormLabel>
                            <FormControl required type="file" onChange={handleImageUpload} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Music File URL</FormLabel>
                            <FormControl required onChange={e => setSrc(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Lyrics</FormLabel>
                            <FormControl as="textarea" rows={3} onChange={e => setLyrics(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Category</FormLabel>
                            <FormSelect required onChange={e => setCatId(e.target.value)}>
                                <option value="0">-- Select a category --</option>
                                {categories.map(c => (
                                    <option value={c.id} key={c.id}>{c.name}</option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Album</FormLabel>
                            <FormSelect required onChange={e => setAlbumId(e.target.value)}>
                                <option value="0">-- Select an album --</option>
                                {albums.map(a => (
                                    <option value={a.id} key={a.id}>{a.title}</option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        <Form.Group className="mb-3">
                            <Button type="submit">Create Song</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}