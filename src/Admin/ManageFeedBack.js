import { Col, Container, Row, Table, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import HeaderAdmin from './Header';

export default function ManageFB() {
    const [fb, setFb] = useState([]);
    const [filteredFb, setFilteredFb] = useState([]);
    const [users, setUsers] = useState([]);
    const [songs, setSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(''); // For song filter
    const [searchUser, setSearchUser] = useState(''); // For user search

    useEffect(() => {
        // Fetch phản hồi
        fetch('https://dsqkll-8090.csb.app/feedback')
            .then(response => response.json())
            .then(data => {
                setFb(data);
                setFilteredFb(data); // Set initial filtered feedback
            })
            .catch(error => console.error('Error fetching feedback:', error));

        // Fetch danh sách người dùng
        fetch('https://dsqkll-8090.csb.app/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));

        // Fetch danh sách bài hát
        fetch('https://dsqkll-8090.csb.app/listsongs')
            .then(response => response.json())
            .then(data => setSongs(data))
            .catch(error => console.error('Error fetching songs:', error));
    }, []);

    // Tìm tên người dùng dựa trên userId
    const getUserName = (userId) => {
        const user = users.find(u => Number(u.id) === Number(userId));
        return user ? user.fullName : 'Unknown User';
    };

    // Tìm tên bài hát dựa trên songId
    const getSongTitle = (songId) => {
        const song = songs.find(s => Number(s.id) === Number(songId));
        return song ? song.title : 'Unknown Song';
    };

    // Xử lý xóa phản hồi
    const handleDelete = async (feedbackId) => {
        // Hiển thị hộp thoại xác nhận
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?');

        if (isConfirmed) {
            try {
                const response = await fetch(`https://dsqkll-8090.csb.app/feedback/${feedbackId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete feedback');
                }

                // Cập nhật danh sách phản hồi sau khi xóa thành công
                setFb(prevFb => prevFb.filter(f => f.id !== feedbackId));
                setFilteredFb(prevFb => prevFb.filter(f => f.id !== feedbackId));
            } catch (error) {
                console.error('Error deleting feedback:', error);
            }
        }
    };

    // Cập nhật danh sách phản hồi dựa trên bộ lọc và tìm kiếm
    useEffect(() => {
        let updatedFb = fb;

        if (selectedSong) {
            updatedFb = updatedFb.filter(fb => Number(fb.songId) === Number(selectedSong));
        }
        if (searchUser) {
            updatedFb = updatedFb.filter(fb => {
                const userName = getUserName(fb.userId);
                return userName.toLowerCase().includes(searchUser.toLowerCase());
            });
        }

        setFilteredFb(updatedFb);
    }, [selectedSong, searchUser, fb]);

    return (
        <Container>
            <Row>
                <HeaderAdmin />
            </Row>
            <Row>
                <Col>
                    <h2>Manage Feedback</h2>
                </Col>
            </Row>
            <hr />
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="filterBySong">
                        <Form.Label>Filter by Song</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedSong}
                            onChange={(e) => setSelectedSong(e.target.value)}
                        >
                            <option value="">All Songs</option>
                            {songs.map(song => (
                                <option key={song.id} value={song.id}>{song.title}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="searchByUser">
                        <Form.Label>Search by Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Username</th>
                        <th>Song</th>
                        <th>Comment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFb.map((feedback, index) => (
                        <tr key={index}>
                            <td>{feedback.id}</td>
                            <td>{getUserName(feedback.userId)}</td>
                            <td>{getSongTitle(feedback.songId)}</td>
                            <td>{feedback.comment}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(feedback.id)}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </Container>
    );
}