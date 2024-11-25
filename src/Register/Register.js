import { Row, Col, Container, Form, Image ,FormCheck ,Button} from 'react-bootstrap'
import { useEffect, useState } from "react";

import './Register.css';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    useEffect(() => {
        fetch(`http://localhost:9999/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(e => console.log(e));

    }, []);
    function handleRegister(e) {
        e.preventDefault();
        let message = "";
        let status = true;
        if(!users.filter(u => u.email === email)){
            message += "Email đã tồn tại";
            status = false;
        }
        if(password !== confirmPassword){
            message += "Password và Comfirm Password khác nhau";
            status = false;
        }
        if (status === false || message.length > 0) {
            alert(message);
        }
        else{
            const newUsers = {
                fullName: fullName,
                email: email,
                password: password,
                RoleId: "2"
            };
            fetch("http://localhost:9999/users", {  
                method: "POST",
                body: JSON.stringify(newUsers),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(resp => resp.json())
                .then(AccountCreated => {
                    alert("Create success! Id: " + AccountCreated.id);
                    window.location.href = "/Login";
                })
                .catch(err => console.log(err));
        }
         
    }

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
                        <h2>Create Account</h2>

                        <Form style={{ textAlign: "left" }}>
                            <Form.Group>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
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
                            <Form.Group >
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group >
                                <FormCheck
                                    type="checkbox"
                                    label="I have read and agreed to the Terms of Service and Privacy Policy"
                                    checked={agreedToTerms}
                                    onChange={e => setAgreedToTerms(e.target.checked)}
                                />
                            </Form.Group>
                            <Form.Group >
                                <Button onClick={handleRegister}>
                                    Register
                                </Button>
                            </Form.Group>
                        </Form>
                        <div className="login-link">
                            <a href="#"><u>Forgot password?</u></a>
                        </div>
                        <hr />
                        <div className="login-link">
                            Do not have an account? <a href="#"><u>Login</u></a>
                        </div>
                    </div>
                    <div className="or">Or</div>
                    <button type="button" className="google-signup">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google logo" />
                        Signup with Google
                    </button>
                    <div className="login-link">Already have an account? <a href="#">Log In</a></div>
                </Col>
            </Row>
        </Container>
    );
}
