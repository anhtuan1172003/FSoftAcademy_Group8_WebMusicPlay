
import { useState, useEffect } from 'react';
import { Button, Container, Form, Nav, Navbar, Col, Row, Image, Carousel, NavDropdown, InputGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function HeaderAdmin() {
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState("");

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
    const handleRemove = () => {
        sessionStorage.removeItem("user")
        window.location.href = "/Home"
    }
    return (
        <Row>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href="#"><span className="admin-span">
                    </span></Navbar.Brand>
                    <Navbar.Brand as={Link} to="/Home"><Image style={{ width: '20%', marginRight: '5px' }} src="/image/icondavid.png"></Image>David Music</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-2"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link as={Link} to="/adminDashboard" className="me-3">Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/ManageAlbum" className="me-3">ManageAlbums</Nav.Link>
                            <Nav.Link as={Link} to="/Admin" className="me-3">ManageSongs</Nav.Link>
                            <Nav.Link as={Link} to="/ManageArtist" className="me-3">ManageArtists</Nav.Link>
                        </Nav>
                        <Form className="d-flex me-2" />




                        {user ? (
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {user.fullName}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to={`/userprofile/${user.id}`}>Trang Cá Nhân</Dropdown.Item>
                                    <Dropdown.Item onClick={handleRemove}>Đăng Xuất</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                        ) : (
                            <div>
                                <Link to="/Login">
                                    <Button variant="outline-success" className="me-2">Đăng nhập</Button>
                                </Link>
                                <Link to="/Register">
                                    <Button variant="success">Đăng ký</Button>
                                </Link>
                            </div>
                        )}

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Row>

    );
}
