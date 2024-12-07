import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, FormSelect, Row } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";

export default function EditSong() {
    const { eId } = useParams();
    const [song, setSong] = useState({});
    const [categories, setCategories] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [title, setTitle] = useState("");
    const [img, setImg] = useState("");
    const [src, setSrc] = useState("");
    const [artist, setArtist] = useState("");
    const [plays, setPlays] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [ranking, setRanking] = useState(1);
    const [albumId, setAlbumId] = useState("");

    useEffect(() => {
        fetch(`https://yvkjyc-8080.csb.app/listsongs/${eId}`)
            .then(res => res.json())
            .then(data => {
                setSong(data);
                setTitle(data.title);
                setImg(data.imgSrc);
                setSrc(data.src);
                setArtist(data.artist);
                setPlays(data.plays);
                setCategoryId(data.categoryId);
                setRanking(data.ranking);
                setAlbumId(data.AlbumID);
            })
            .catch(e => console.log(e));

        fetch("https://yvkjyc-8080.csb.app/categories")
            .then(res => res.json())
            .then(result => setCategories(result))
            .catch(error => console.log(error));

        fetch("https://yvkjyc-8080.csb.app/albums")
            .then(res => res.json())
            .then(result => setAlbums(result))
            .catch(error => console.log(error));
    }, [eId]);

    function handleUpdate(e) {
        e.preventDefault();
        let message = "";
        let status = true;
        if (title.length === 0) {
            message += "Product name is required\n";
            status = false;
        }
        if (categoryId === "0") {
            message += "You must choose a category!";
            status = false;
        }
        if (!status || message.length > 0) {
            alert(message);
        } else {
            const updatedSong = {
                title: title,
                imgSrc: img,
                src: src,
                artist: artist,
                plays: plays,
                ranking: ranking,
                AlbumID: albumId,
                categoryId: categoryId,
            };

            fetch(`https://yvkjyc-8080.csb.app/listsongs/${eId}`, {
                method: "PUT",
                body: JSON.stringify(updatedSong),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(resp => resp.json())
                .then(updatedSong => {
                    alert("Update success! Id: " + updatedSong.id);
                    window.location.href = "/admin";
                })
                .catch(err => console.log(err));
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h3 style={{ textAlign: "center" }}>Edit Song</h3>
                </Col>
                <hr />
                <Row>
                    <Col>
                        <Link to={"/admin"}>Back to List</Link>
                    </Col>
                </Row>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={handleUpdate}>
                        <FormGroup>
                            <FormLabel>Id</FormLabel>
                            <FormControl value={song?.id || ''} disabled />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Title</FormLabel>
                            <FormControl value={title} onChange={e => setTitle(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Image</FormLabel>
                            <FormControl value={img} onChange={e => setImg(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Src Music</FormLabel>
                            <FormControl value={src} onChange={e => setSrc(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Artist</FormLabel>
                            <FormControl value={artist} onChange={e => setArtist(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Play</FormLabel>
                            <FormControl value={plays} type="number" min={0} max={100000000} onChange={e => setPlays(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Category</FormLabel>
                            <FormSelect value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                                <option value="0">-- Select a category --</option>
                                {categories.map(c => (
                                    <option value={c.id} key={c.id}>{c.name}</option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Ranking</FormLabel>
                            <FormControl value={ranking} type="number" min={0} max={10} onChange={e => setRanking(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Album</FormLabel>
                            <FormSelect value={albumId} onChange={e => setAlbumId(e.target.value)}>
                                <option value="0">-- Select an album --</option>
                                {albums.map(a => (
                                    <option value={a.id} key={a.id}>{a.title}</option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        <Form.Group className="mb-3">
                            <Button type="submit">Update</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
