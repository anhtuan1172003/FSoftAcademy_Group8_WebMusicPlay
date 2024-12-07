import { Container, Row, Col, Image, Form, Button, FormCheck } from 'react-bootstrap';
import React, { useState , useEffect} from 'react';
import {Link} from 'react-router-dom'

import '../Register/Register.css';
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:9999/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(e => console.log(e));

    }, []);
    function handleLogin(e){
        e.preventDefault();
        const user = users.find(u => u.email === username && u.password === password);
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            console.log('Login successful');
            if (user.RoleId === "1") {
                window.location.href = "/Admin";
            } else {
                window.location.href = "/Home";
            }
        } else {
            alert('Email Đăng Nhập Hoặc Mật Khẩu Không Đúng');
        }
    };
    return (
        <Container className='container1'>
            <Row>
                <Col xs={12} md={6} className="left-panel1">
                    <div className="logo">
                        <Image src="./image/icondavid.png"></Image>
                    </div>
                </Col>
                <Col xs={12} md={6} className="right-panel1">
                    <div className="form-container">
                        <h2>Login</h2>
                        <Form style={{ textAlign: "left" }}>
                            <Form.Group >
                                <Form.Label>UserName</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="UserName"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <FormCheck
                                    type="checkbox"
                                    label="Remember me"
                                    checked={rememberMe}
                                    onChange={e => setRememberMe(e.target.checked)}
                                />
                            </Form.Group>
                            <Form.Group >
                                <Button onClick={handleLogin} className="create-account-btn">
                                    Login
                                </Button>
                            </Form.Group>
                        </Form>
                        <div className="login-link"> <a href="#"><u>Forgot password?</u></a></div>
                        <hr />
                        <div className="login-link" >Do not have an account? <Link  to="/Register"><Button className="create-account-btn"><u>Register</u></Button></Link></div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
