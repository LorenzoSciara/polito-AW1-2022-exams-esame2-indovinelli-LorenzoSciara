import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

function LoginForm(props) {
    const [username, setUsername] = useState('testuser@polito.it');
    const [password, setPassword] = useState('password');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setMessage('');
        const credentials = { username, password };

        let valid = true;
        if (username === '' || password === '') {
            valid = false;
            props.setMessage('Username and/or password can not be empty.');
        }
        if (username.trim().length === 0) {
            valid = false;
            props.setMessage('Username can not have only spaces.');
        }
        if (!validator.isEmail(username)) {
            valid = false;
            props.setMessage('Check the email format.');
        }

        if (valid) {
            props.login(credentials);
            props.setMessage('');
        }
    };

    const handleBack = (event) => {
        event.preventDefault();
        setUsername('');
        setPassword('');
        props.setMessage('');
        navigate('/');
    }

    return (
        <Container>
            <ul></ul>
            <Container>
                <Row><Col>
                    {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
                </Col></Row>
            </Container>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h2 className="text-center">Log-In</h2>
                    <Form>
                        <Form.Group controlId='username'>
                            <Form.Label>email</Form.Label>
                            <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        </Form.Group>
                        <ul></ul>
                        <Row>
                            <Col md={5} xs={5}>
                                <Button onClick={handleBack} variant="danger">Back</Button>{" "}
                            </Col>
                            <Col md={2} xs={2}></Col>
                            <Col md={5} xs={5}>
                                <Button onClick={handleSubmit} variant="success">Log-In</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

function LogoutButton(props) {
    return (
        <Col>
            <span className="text-white">Welcome,{props.user?.name}</span>{' '}
            <Button onClick={props.logout} variant='danger'> <i className="bi bi-box-arrow-right"></i>{" "} Log-Out</Button>
        </Col>
    )
}


export { LoginForm, LogoutButton };