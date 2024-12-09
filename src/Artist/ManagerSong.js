import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Col, Row, InputGroup, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import HeaderAt from './HeaderArtist';

const ManageTableArtist = () => {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [loggedInArtist, setLoggedInArtist] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get logged-in artist from session storage
    const userJson = sessionStorage.getItem('artist');
    if (userJson) {
      const user = JSON.parse(userJson);
      setLoggedInArtist(user);
    } else {
      // Redirect to login if no user is logged in
      navigate('/login');
    }

    // Fetch categories
    fetch("https://dsqkll-8090.csb.app/categories")
      .then(res => res.json())
      .then(result => setCategories(result))
      .catch(error => console.log(error));

    // Fetch songs
    fetch('https://dsqkll-8090.csb.app/listsongs')
      .then(response => response.json())
      .then(data => {
        let filteredSongs = data;
        
        // Filter songs by logged-in artist
        if (loggedInArtist) {
          filteredSongs = filteredSongs.filter(song => song.artistID == loggedInArtist.id);
        }

        // Apply search filter
        if (search.length > 0) {
          filteredSongs = filteredSongs.filter(p =>
            removeDiacritics(p.title.toLowerCase()).includes(removeDiacritics(search.toLowerCase()))
          );
        }

        setSongs(filteredSongs);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [search, loggedInArtist, navigate]);

  const removeDiacritics = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  };

  const handleDelete = (songId) => {
    if (window.confirm("Do you want to delete?")) {
      fetch("https://dsqkll-8090.csb.app/listsongs/" + songId, { method: "DELETE" })
        .then(() => {
          alert("Delete success!");
          // Refresh the songs list instead of reloading the page
          setSongs(songs.filter(song => song.id !== songId));
        })
        .catch(error => console.error('Error deleting data:', error));
    }
  };

  const calculateRevenue = (plays) => {
    return plays * 100;
  };

  if (!loggedInArtist) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <HeaderAt></HeaderAt>
      <Row style={{marginTop:'20px'}}>
        <Col md={8}>
          <h1>Manage My Songs</h1>
        </Col>
        <Col md={3}>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Search by name"
              aria-label="Search"
              aria-describedby="basic-addon1"
              onChange={e => setSearch(e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col>
          <Link to={"/addSongA"} className="btn btn-primary mb-3">
            Add
          </Link>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md={12}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Image</th>
                <th>Src</th>
                <th>Plays</th>
                <th>Category</th>
                <th>Revenue (VND)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={index}>
                  <td>{song.id}</td>
                  <td>
                    <Link to={`/listsongs/${song.id}`}>
                      {song.title}
                    </Link> 
                  </td>
                  <td><img src={song.imgSrc} alt={song.title} style={{ width: '50px', height: '50px' }} /></td>
                  <td>{song.src}</td>
                  <td>{song.plays}</td>
                  <td>{categories?.find(c => c.id == song.categoryId)?.name}</td>
                  <td>{calculateRevenue(song.plays).toLocaleString()} VND</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(song.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageTableArtist;