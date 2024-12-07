import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, FormSelect, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AddSong() {
    const [song, setSong] = useState({});
    const [title, setTitle] = useState("");
    const [img, setImg] = useState("");
    const [src, setSrc] = useState("");
    const [artistId, setArtistId] = useState();
    const [plays, setPlay] = useState(0);
    const [categoryId, setCatId] = useState("0");
    const [ranking, setRank] = useState(1);
    const [albumId, setAlbumId] = useState(1);
    const [categories, setCategories] = useState([]);
    const [album, setAlbum] = useState([]);
    const [lyrics, setLyrics] = useState([]);
    const [artist, setArtist] = useState([]);

    useEffect(() => {
        fetch(`https://yl28wx-8090.csb.app/listsongs`)
            .then(res => res.json())
            .then(data => {
                setSong(data.id)
                setTitle(data.title)
                setImg(data.img)
                setSrc(data.src)
                setArtistId(data.artistID)
                setPlay(data.plays)
                setCatId(data.categoryId)
                setRank(data.ranking)
                setAlbumId(data.AlbumID)
                setLyrics(data.lyrics)
            })
            .catch(e => console.log(e))


        fetch("https://yl28wx-8090.csb.app/categories")
            .then(res => res.json())
            .then(result => setCategories(result))
            .catch(error => console.log(error));
        fetch("https://yl28wx-8090.csb.app/artist")
            .then(res => res.json())
            .then(result => setArtist(result))
            .catch(error => console.log(error));

        fetch("https://yl28wx-8090.csb.app/albums")
            .then(res => res.json())
            .then(result => setAlbum(result))

    }, [])

    function handleCreate(e) {
        e.preventDefault();
        let message = "";
        let status = true;
        if (title.length === 0) {
            message += "Product name is required\n";
            status = false;
        }
        if (categoryId === 0) {
            message += "You must choose a category!";
            status = false;
        } if (status === false || message.length > 0) {
            alert(message);
        } else {
            const newSong = {
                title: title,
                imgSrc: img,
                src: src,
                artistID: artistId,
                plays: plays,
                ranking: ranking,
                AlbumID: albumId,
                lyrics: lyrics,
                categoryId: categoryId,

            };

            fetch("https://yl28wx-8090.csb.app/listsongs", {
                method: "POST",
                body: JSON.stringify(newSong),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(resp => resp.json())
                .then(SONGCreated => {
                    alert("Create success! Id: " + SONGCreated.id);
                    window.location.href = "/admin";
                })
                .catch(err => console.log(err));
        }
    }
    return (
        <Container>
            <Row>
                <Col>
                    <h3 style={{ textAlign: "center" }}>Create a new Song</h3>
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
                    <FormGroup>
                        <FormLabel>Id</FormLabel>
                        <FormControl disabled></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Title</FormLabel>
                        <FormControl onChange={e => setTitle(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Image</FormLabel>
                        <FormControl onChange={e => setImg(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Src Music</FormLabel>
                        <FormControl  onChange={e => setSrc(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Lyrics</FormLabel>
                        <FormControl onChange={e => setLyrics(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Artist</FormLabel>
                        <FormSelect onChange={e => setArtistId(parseInt(e.target.value))}>
                            <option value="0">-- Select a artist --</option>
                            {artist?.map(c => (
                                <option value={c.id} key={c.id}>{c.name}</option>
                            ))
                            }
                        </FormSelect>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Play</FormLabel>
                        <FormControl type="number" min={0} max={100000000} onChange={e => setPlay(e.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Category</FormLabel>
                        <FormSelect onChange={e => setCatId(parseInt(e.target.value))}>
                            <option value="0">-- Select a category --</option>
                            {categories?.map(c => (
                                <option value={c.id} key={c.id}>{c.name}</option>
                            ))
                            }
                        </FormSelect>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>ranking</FormLabel>
                        <FormControl onChange={e => setRank(parseInt(e.target.value))} type="number" min={0} max={10}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Album</FormLabel>
                        <FormSelect onChange={e => setAlbumId(parseInt(e.target.value))}>
                            <option value="0">-- Select a album --</option>
                            {album?.map(c => (
                                <option value={c.id} key={c.id}>{c.title}</option>
                            ))
                            }
                        </FormSelect>
                    </FormGroup>
                    <Form.Group className="mb-3">
                        <Button onClick={handleCreate}>Create</Button>
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    )
}