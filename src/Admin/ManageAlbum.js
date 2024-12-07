import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import HeaderAdmin from './Header';

const ManageAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState({ id: '', title: '', cover: '', cateId: '' });

  useEffect(() => {
    fetch('https://yvkjyc-8080.csb.app/albums')
      .then(response => response.json())
      .then(data => setAlbums(data))
      .catch(error => console.error('Error fetching albums:', error));
  }, []);

  const handleShowModal = (album = { id: '', title: '', cover: '', cateId: '' }) => {
    setCurrentAlbum(album);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveAlbum = () => {
    let newId = currentAlbum.id;
    if (!currentAlbum.id) {
      const maxId = albums.reduce((max, album) => {
        const albumId = parseInt(album.id, 10);
        return albumId > max ? albumId : max;
      }, 0);
      newId = maxId + 1;
    }

    const updatedAlbum = { ...currentAlbum, id: newId.toString() };
    const method = currentAlbum.id ? 'PUT' : 'POST';
    const url = currentAlbum.id ? `https://yvkjyc-8080.csb.app/albums/${currentAlbum.id}` : 'https://yvkjyc-8080.csb.app/albums';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAlbum)
    })
      .then(response => response.json())
      .then(data => {
        if (method === 'POST') {
          setAlbums([...albums, data]);
        } else {
          setAlbums(albums.map(album => (album.id === data.id ? data : album)));
        }
        handleCloseModal();
      })
      .catch(error => console.error('Error saving album:', error));
  };

  const handleDelete = (id) => {
    if (window.confirm('Do you want to delete this album?')) {
      fetch(`https://yvkjyc-8080.csb.app/albums/${id}`, { method: 'DELETE' })
        .then(() => {
          alert('DELETE success');
          setAlbums(albums.filter(album => album.id !== id));
        })
        .catch(error => console.error('Error deleting album:', error));
    }
  };

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Row><HeaderAdmin/></Row>
      <Row>
        <Col md={8}>
          <h1>Manage Albums</h1>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search albums by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col>
          <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>Add new album</Button>
        </Col>
      </Row>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Cover</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlbums.map((album, index) => (
            <tr key={index}>
              <td>{album.id}</td>
              <td>{album.title}</td>
              <td><img src={album.cover} alt={album.title} style={{ width: '50px' }} /></td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleShowModal(album)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(album.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentAlbum.id ? 'Edit Album' : 'Add New Album'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAlbumTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter album title"
                value={currentAlbum.title}
                onChange={(e) => setCurrentAlbum({ ...currentAlbum, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formAlbumCover">
              <Form.Label>Cover</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter album cover URL"
                value={currentAlbum.cover}
                onChange={(e) => setCurrentAlbum({ ...currentAlbum, cover: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSaveAlbum}>
            {currentAlbum.id ? 'Save Changes' : 'Add Album'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageAlbums;
