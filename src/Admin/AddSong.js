import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, FormSelect, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imgDB } from "../Firebase/Config"; // Sử dụng imgDB thay vì uploadDB
import { v4 } from "uuid";


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
    const [isUploadingImg, setIsUploadingImg] = useState(false);
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);
    const [audio, setAudio] = useState(""); 

    useEffect(() => {
        fetch(`http://localhost:9999/listsongs`)
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


        fetch("http://localhost:9999/categories")
            .then(res => res.json())
            .then(result => setCategories(result))
            .catch(error => console.log(error));
        fetch("http://localhost:9999/artist")
            .then(res => res.json())
            .then(result => setArtist(result))
            .catch(error => console.log(error));

        fetch("http://localhost:9999/albums")
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
        }
        // Kiểm tra artistId
        if (!artistId) {
            message += "You must choose an artist!\n";
            status = false;
        }

        if (status === false || message.length > 0) {
            alert(message);
        } else {
            const newSong = {
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

            fetch("http://localhost:9999/listsongs", {
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
        const file = e.target.files[0];
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
                        <FormControl required type="file" onChange={handleImageUpload} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Audio File</FormLabel>
                        <FormControl required type="file" onChange={handleAudioUpload} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Lyrics</FormLabel>
                        <FormControl as="textarea" onChange={e => setLyrics(e.target.value)}  style={{height: "400px"}}/>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Artist</FormLabel>
                        <FormSelect
                            onChange={e => {
                                const selectedValue = e.target.value;
                                console.log("Selected artist ID:", selectedValue);

                                // Giữ nguyên giá trị string, chỉ loại bỏ giá trị mặc định "0"
                                setArtistId(selectedValue !== '0' ? selectedValue : null);
                            }}
                        >
                            <option value="0">-- Select a artist --</option>
                            {artist?.map(c => (
                                <option value={c.id} key={c.id}>{c.name}</option>
                            ))}
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
                        <Button onClick={handleCreate} disabled={isUploadingImg || isUploadingAudio}>
                            {isUploadingImg || isUploadingAudio ? "Uploading files..." : "Create Song"}
                        </Button>
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    )
}