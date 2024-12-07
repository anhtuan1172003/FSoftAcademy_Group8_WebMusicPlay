import { Container, Row, Col, Image, Form, Button, FormCheck, Alert } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../Register/Register.css';

export default function LoginArtist() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://yl28wx-8090.csb.app/artist')
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(e => {
                console.log('Error fetching artists:', e);
                setError('Failed to fetch artist data. Please try again later.');
            });
    }, []);

    function handleLogin(e) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const artist = artists.find(a => a.email === email && a.password === password);
        if (artist) {
            sessionStorage.setItem('artist', JSON.stringify(artist));
            if (rememberMe) {
                localStorage.setItem('userEmail', email);
            } else {
                localStorage.removeItem('userEmail');
            }
            console.log('Login successful');
            navigate('/ManageTableArtist');
        } else {
            setError('Invalid email or password');
        }
        setIsLoading(false);
    }

    useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <Container className='container1'>
            <Row>
                <Col xs={12} md={6} className="left-panel1">
                    <div className="logo">
                        <Image src="./image/icondavid.png" alt="Logo" />
                    </div>
                </Col>
                <Col xs={12} md={6} className="right-panel1">
                    <div className="form-container">
                        <h2>Artist Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleLogin} style={{ textAlign: "left" }}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FormCheck
                                    type="checkbox"
                                    label="Remember me"
                                    checked={rememberMe}
                                    onChange={e => setRememberMe(e.target.checked)}
                                />
                            </Form.Group>
                            <Button 
                                type="submit" 
                                className="create-account-btn" 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}