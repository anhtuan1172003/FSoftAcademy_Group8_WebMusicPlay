import { useState, useEffect } from 'react';
import { Button, Container, Form, Nav, Navbar, Row, Image, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function HeaderAt() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = sessionStorage.getItem("artist");

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
                            <Nav.Link as={Link} to="/artistDashboard" className="me-3">Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/ManageTableArtist" className="me-3">Manage My Songs</Nav.Link>
                        </Nav>
                        <Form className="d-flex me-2" />



                        {user ? (
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                   hi {user.name}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
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