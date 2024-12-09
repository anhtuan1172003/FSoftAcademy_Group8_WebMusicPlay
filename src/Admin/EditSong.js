import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, FormSelect, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { imgDB } from "../Firebase/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditSong() {
    const { eId } = useParams();
    const [song, setSongs] = useState({});
    const [categories, setCategories] = useState([]);
    const [album, setAlbum] = useState([]);
    const [title, setTitle] = useState("");
    const [img, setImg] = useState("");
    const [src, setSrc] = useState("");
    const [artist, setArtist] = useState([]);
    const [plays, setPlay] = useState(0);
    const [categoryId, setCatId] = useState('');
    const [ranking, setRank] = useState(0);
    const [albumId, setAlbumId] = useState('');
    const [audio, setAudio] = useState("");
    const [isUploadingImg, setIsUploadingImg] = useState(false);
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);
    const [artistId, setArtistId] = useState();
    const [lyrics, setLyrics] = useState("")

    useEffect(() => {
        fetch(`https://dsqkll-8090.csb.app/listsongs/${eId}`)
            .then(res => res.json())
            .then(data => {
                setSongs(data)
                setTitle(data.title)
                setImg(data.imgSrc)
                setAudio(data.src)
                setLyrics(data.lyrics)
                setArtistId(data.artistID)
                setPlay(data.plays)
                setCatId(data.categoryId)
                setRank(data.ranking)
                setAlbumId(data.AlbumID)
            })
            .catch(e => console.log(e))

        fetch("https://dsqkll-8090.csb.app/categories")
            .then(res => res.json())
            .then(result => setCategories(result))
            .catch(error => console.log(error));

        fetch("https://dsqkll-8090.csb.app/albums")
            .then(res => res.json())
            .then(result => setAlbum(result));
        fetch("https://dsqkll-8090.csb.app/artist")
            .then(res => res.json())
            .then(result => setArtist(result))
            .catch(error => console.log(error));
    }, [eId])

    function handleCreate(e) {
        e.preventDefault();
        let message = "";
        let status = true;
        if (title.length === 0) {
            message += "Product name is required\n";
            status = false;
        }
        if (categoryId === '0') {
            message += "You must choose a category!";
            status = false;
        } if (status === false || message.length > 0) {
            alert(message);
        } else {
            const editSong = {
                title: title,
                imgSrc: img,
                src: audio,
                artistID: artistId,
                plays: plays,
                ranking: ranking,
                AlbumID: albumId,
                lyrics: lyrics.trim(),
                categoryId: categoryId,
            };

            fetch(`https://dsqkll-8090.csb.app/listsongs/${eId}`, {
                method: "PUT",
                body: JSON.stringify(editSong),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(resp => resp.json())
                .then(SONGCreated => {
                    alert("Update success! Id: " + SONGCreated.id);
                    window.location.href = "/admin";
                })
                .catch(err => console.log(err));
        }
    }
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imgRef = ref(imgDB, `musicimages/${file.name}_${v4()}`);
            setIsUploadingImg(true);
            try {
                const snapshot = await uploadBytes(imgRef, file);
                const url = await getDownloadURL(snapshot.ref);
                setImg(url);
                setIsUploadingImg(false);
            } catch (error) {
                console.error("Error uploading image: ", error);
                setIsUploadingImg(false);
            }
        }
    };
    const handleAudioUpload = async (e) => {
        let file = e.target.files[0];
        if (file) {
            const audioRef = ref(imgDB, `musicaudio/${file.name}_${v4()}`);
            setIsUploadingAudio(true);
            try {
                const snapshot = await uploadBytes(audioRef, file);
                const url = await getDownloadURL(snapshot.ref);
                setAudio(url);
                setIsUploadingAudio(false);
            } catch (error) {
                console.error("Error uploading audio: ", error);
                setIsUploadingAudio(false);
            }
        }
    };

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
                    <FormGroup>
                        <FormLabel>Id</FormLabel>
                        <FormControl value={song?.id} disabled />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Title</FormLabel>
                        <FormControl value={title} onChange={e => setTitle(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Image</FormLabel>
                        <FormControl type="file" onChange={handleImageUpload} />
                        {img && <img src={img} alt="Preview" style={{ marginTop: "10px", maxWidth: "200px" }} />}
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Audio File</FormLabel>
                        <FormControl type="file" onChange={handleAudioUpload} />
                        {audio && (
                            <div style={{ marginTop: "10px" }}>
                                <p>Current audio:</p>
                                <audio controls style={{ width: "100%" }}>
                                    <source src={audio} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Lyrics</FormLabel>
                        <FormControl as="textarea" onChange={e => setLyrics(e.target.value)} style={{ height: "400px" }} value={song.lyrics} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Artist</FormLabel>
                        <FormSelect onChange={e => setArtistId(e.target.value)} value={song.artistID}>
                            <option value="0">-- Select a artist --</option>
                            {artist?.map(c => (
                                <option value={c.id} key={c.id}>{c.name}</option>
                            ))
                            }
                        </FormSelect>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Play</FormLabel>
                        <FormControl value={plays} type="number" min={0} max={100000000} onChange={e => setPlay(e.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Category</FormLabel>
                        <FormSelect
                            value={categoryId}
                            onChange={e => setCatId((e.target.value))}>
                            <option value="0">-- Select a category --</option>
                            {categories?.map(c => (
                                <option value={c.id} key={c.id}>{c.name}</option>
                            ))
                            }
                        </FormSelect>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>ranking</FormLabel>
                        <FormControl value={ranking} onChange={e => setRank((e.target.value))} type="number" min={0} max={10}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Album</FormLabel>
                        <FormSelect
                            value={albumId}
                            onChange={e => setAlbumId((e.target.value))}>
                            <option value="0">-- Select a album --</option>
                            {album?.map(c => (
                                <option value={c.id} key={c.id}>{c.title}</option>
                            ))
                            }
                        </FormSelect>
                    </FormGroup>
                    <Form.Group className="mb-3">
                        <Button onClick={handleCreate}>Update</Button>
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    )
}