import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import HeaderAdmin from './Header';

const ManageArtists = () => {
  const [artists, setArtists] = useState([]);
  const [categories, setCategories] = useState([]); // Add this to store categories
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentArtist, setCurrentArtist] = useState({ id: '', name: '', cateId: '', Gender: '', dob: '' });

  useEffect(() => {
    fetch('https://yvkjyc-8080.csb.app/artist')
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(error => console.error('Error fetching data:', error));

    // Fetch categories
    fetch('https://yvkjyc-8080.csb.app/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleShowModal = (artist = { id: '', name: '', cateId: '', Gender: '', dob: '' }) => {
    setCurrentArtist(artist);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveArtist = () => {
    let newId = currentArtist.id;
    if (!currentArtist.id) {
      const maxId = artists.reduce((max, artist) => {
        const artistId = parseInt(artist.id, 10);
        return artistId > max ? artistId : max;
      }, 0);
      newId = maxId + 1;
    }

    const updatedArtist = { ...currentArtist, id: newId.toString() };
    const method = currentArtist.id ? 'PUT' : 'POST';
    const url = currentArtist.id ? `https://yvkjyc-8080.csb.app/artist/${currentArtist.id}` : 'https://yvkjyc-8080.csb.app/artist';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedArtist)
    })
      .then(response => response.json())
      .then(data => {
        if (method === 'POST') {
          setArtists([...artists, data]);
        } else {
          setArtists(artists.map(artist => (artist.id === data.id ? data : artist)));
        }
        handleCloseModal();
      })
      .catch(error => console.error('Error saving data:', error));
  };

  const handleDelete = (id) => {
    if (window.confirm('Do you want delete?')) {
      fetch(`https://yvkjyc-8080.csb.app/artist/${id}`, { method: 'DELETE' })
        .then(() => {
          alert('DELETE success');
          setArtists(artists.filter(artist => artist.id !== id));
        })
        .catch(error => console.error('Error deleting data:', error));
    }
  };

  const getCategoryName = (cateId) => {
    const category = categories.find(category => category.id === cateId);
    return category ? category.name : 'Unknown';
  };

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Row>
        <HeaderAdmin/>
      </Row>
      <Row>
        <Col md={8}>
          <h1>Manage Artists</h1>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search artists by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col>
          <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>Add new artist</Button>
        </Col>
      </Row>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Category</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredArtists.map((artist, index) => (
            <tr key={index}>
              <td>{artist.id}</td>
              <td>{artist.name}</td>
              <td>{getCategoryName(artist.cateId)}</td>
              <td>{artist.Gender}</td>
              <td>{artist.dob}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleShowModal(artist)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(artist.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentArtist.id ? 'Edit Artist' : 'Add New Artist'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formArtistName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter artist name"
                value={currentArtist.name}
                onChange={(e) => setCurrentArtist({ ...currentArtist, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formArtistCateId">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={currentArtist.cateId}
                onChange={(e) => setCurrentArtist({ ...currentArtist, cateId: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formArtistGender">
              <Form.Label>Gender</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Male"
                  name="gender"
                  value="Male"
                  checked={currentArtist.Gender === 'Male'}
                  onChange={(e) => setCurrentArtist({ ...currentArtist, Gender: e.target.value })}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Female"
                  name="gender"
                  value="Female"
                  checked={currentArtist.Gender === 'Female'}
                  onChange={(e) => setCurrentArtist({ ...currentArtist, Gender: e.target.value })}
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formArtistDob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={currentArtist.dob}
                onChange={(e) => setCurrentArtist({ ...currentArtist, dob: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSaveArtist}>
            {currentArtist.id ? 'Save Changes' : 'Add Artist'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageArtists;
